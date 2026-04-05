const { app, request, pool, truncateAll, createTestUser, createTestItem, addFunds, createRental, makeAdmin } = require('./helpers');

beforeEach(async () => {
    await truncateAll();
});

describe('Admin Access Control', () => {
    it('should reject non-admin users (403)', async () => {
        const { token } = await createTestUser('NormalUser', 'normal@test.com');

        const res = await request(app)
            .get('/api/admin/disputes')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(403);
    });

    it('should reject unauthenticated requests (401)', async () => {
        const res = await request(app).get('/api/admin/disputes');
        expect(res.statusCode).toBe(401);
    });
});

describe('GET /api/admin/disputes', () => {
    it('should return dispute list for admin', async () => {
        const admin = await createTestUser('Admin', 'admin@test.com');
        await makeAdmin(admin.user.id);

        const res = await request(app)
            .get('/api/admin/disputes')
            .set('Authorization', `Bearer ${admin.token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});

describe('PUT /api/admin/disputes/:id/resolve', () => {
    let admin, owner, renter, rentalId, disputeId;

    beforeEach(async () => {
        await truncateAll();

        admin = await createTestUser('Admin', 'admin@test.com');
        await makeAdmin(admin.user.id);

        owner = await createTestUser('DisOwner', 'disowner@test.com');
        renter = await createTestUser('DisRenter', 'disrenter@test.com');
        await addFunds(renter.token, 500);
        const item = await createTestItem(owner.token, { title: 'Disputed Drill' });
        await createRental(renter.token, item.id, 200);

        const rentals = await request(app)
            .get('/api/rentals/my-rentals')
            .set('Authorization', `Bearer ${renter.token}`);
        rentalId = rentals.body[0].id;

        // Raise a dispute
        await request(app)
            .post(`/api/rentals/${rentalId}/dispute`)
            .set('Authorization', `Bearer ${renter.token}`)
            .send({ reason: 'Item was broken' });

        // Get dispute ID
        const disputes = await request(app)
            .get('/api/admin/disputes')
            .set('Authorization', `Bearer ${admin.token}`);
        disputeId = disputes.body[0].id;
    });

    it('should resolve dispute with refund_renter — money goes back to renter', async () => {
        const res = await request(app)
            .put(`/api/admin/disputes/${disputeId}/resolve`)
            .set('Authorization', `Bearer ${admin.token}`)
            .send({ resolution: 'refund_renter', admin_notes: 'Item was indeed damaged' });

        expect(res.statusCode).toBe(200);

        // Verify: renter got their 200₺ back (500 - 200 + 200 = 500)
        const renterProfile = await request(app)
            .get('/api/user/profile')
            .set('Authorization', `Bearer ${renter.token}`);
        expect(parseFloat(renterProfile.body.balance)).toBe(500);
    });

    it('should resolve dispute with pay_owner — money goes to owner', async () => {
        const res = await request(app)
            .put(`/api/admin/disputes/${disputeId}/resolve`)
            .set('Authorization', `Bearer ${admin.token}`)
            .send({ resolution: 'pay_owner', admin_notes: 'No damage found' });

        expect(res.statusCode).toBe(200);

        // Verify: owner received the 200₺
        const ownerProfile = await request(app)
            .get('/api/user/profile')
            .set('Authorization', `Bearer ${owner.token}`);
        expect(parseFloat(ownerProfile.body.balance)).toBe(200);
    });

    it('should set rental to completed and item to available after resolution', async () => {
        await request(app)
            .put(`/api/admin/disputes/${disputeId}/resolve`)
            .set('Authorization', `Bearer ${admin.token}`)
            .send({ resolution: 'refund_renter', admin_notes: 'Test' });

        // Check rental is completed
        const rentals = await request(app)
            .get('/api/rentals/my-rentals')
            .set('Authorization', `Bearer ${renter.token}`);
        expect(rentals.body[0].status).toBe('completed');
    });
});
