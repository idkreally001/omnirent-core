const { app, request, pool, truncateAll, createTestUser, createTestItem, addFunds, createRental } = require('./helpers');

beforeEach(async () => {
    await truncateAll();
});

describe('POST /api/rentals — Core Rental Creation', () => {
    it('should prevent renting your own item', async () => {
        const owner = await createTestUser('Self Renter', 'self@test.com');
        await addFunds(owner.token, 500);
        const item = await createTestItem(owner.token, { title: 'My Own Drill' });

        const res = await createRental(owner.token, item.id, 50);

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/cannot rent your own/i);
    });

    it('should prevent renting with insufficient funds', async () => {
        const owner = await createTestUser('Rich Owner', 'rich@test.com');
        const renter = await createTestUser('Broke Renter', 'broke@test.com');
        const item = await createTestItem(owner.token, { title: 'Expensive Drill', price: 100 });
        // Renter has 0 balance — no addFunds call

        const res = await createRental(renter.token, item.id, 100);

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/insufficient funds/i);
    });

    it('should complete a successful rental', async () => {
        const owner = await createTestUser('Owner', 'owner@test.com');
        const renter = await createTestUser('Renter', 'renter@test.com');
        await addFunds(renter.token, 500);
        const item = await createTestItem(owner.token, { title: 'Drill', price: 50 });

        const res = await createRental(renter.token, item.id, 100);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/rental successful/i);

        // Verify: renter balance was deducted
        const renterProfile = await request(app)
            .get('/api/user/profile')
            .set('Authorization', `Bearer ${renter.token}`);
        expect(parseFloat(renterProfile.body.balance)).toBe(400); // 500 - 100

        // Verify: item is now rented (not available)
        const itemRes = await request(app).get(`/api/items/${item.id}`);
        expect(itemRes.body.status).toBe('rented');
    });

    it('should prevent double-booking the same item', async () => {
        const owner = await createTestUser('Owner', 'owner@test.com');
        const renter1 = await createTestUser('Renter1', 'renter1@test.com');
        const renter2 = await createTestUser('Renter2', 'renter2@test.com');
        await addFunds(renter1.token, 500);
        await addFunds(renter2.token, 500);
        const item = await createTestItem(owner.token, { title: 'Solo Drill' });

        // First rental succeeds
        const res1 = await createRental(renter1.token, item.id, 50);
        expect(res1.statusCode).toBe(200);

        // Second rental should fail (item is now 'rented')
        const res2 = await createRental(renter2.token, item.id, 50);
        expect(res2.statusCode).toBe(400);
        expect(res2.body.error).toMatch(/unavailable|already rented/i);
    });
});

describe('Rental Lifecycle — Full State Machine', () => {
    let owner, renter, item, rentalId;

    beforeEach(async () => {
        await truncateAll();
        owner = await createTestUser('Owner', 'owner@test.com');
        renter = await createTestUser('Renter', 'renter@test.com');
        await addFunds(renter.token, 1000);
        item = await createTestItem(owner.token, { title: 'Lifecycle Drill', price: 50 });
        await createRental(renter.token, item.id, 200);

        // Fetch the rental ID
        const rentals = await request(app)
            .get('/api/rentals/my-rentals')
            .set('Authorization', `Bearer ${renter.token}`);
        rentalId = rentals.body[0].id;
    });

    it('should start in pending_handover status', async () => {
        const rentals = await request(app)
            .get('/api/rentals/my-rentals')
            .set('Authorization', `Bearer ${renter.token}`);

        expect(rentals.body[0].status).toBe('pending_handover');
    });

    it('should transition: pending_handover → active (confirm handover)', async () => {
        const res = await request(app)
            .put(`/api/rentals/${rentalId}/confirm-handover`)
            .set('Authorization', `Bearer ${renter.token}`);

        expect(res.statusCode).toBe(200);

        const rentals = await request(app)
            .get('/api/rentals/my-rentals')
            .set('Authorization', `Bearer ${renter.token}`);
        expect(rentals.body[0].status).toBe('active');
    });

    it('should transition: active → returned_by_renter (return)', async () => {
        // First, activate
        await request(app)
            .put(`/api/rentals/${rentalId}/confirm-handover`)
            .set('Authorization', `Bearer ${renter.token}`);

        // Then return
        const res = await request(app)
            .put(`/api/rentals/${rentalId}/return`)
            .set('Authorization', `Bearer ${renter.token}`);

        expect(res.statusCode).toBe(200);

        const rentals = await request(app)
            .get('/api/rentals/my-rentals')
            .set('Authorization', `Bearer ${renter.token}`);
        expect(rentals.body[0].status).toBe('returned_by_renter');
    });

    it('should transition: returned_by_renter → completed (confirm receipt) + release escrow', async () => {
        // Full flow: handover → return → confirm receipt
        await request(app)
            .put(`/api/rentals/${rentalId}/confirm-handover`)
            .set('Authorization', `Bearer ${renter.token}`);
        await request(app)
            .put(`/api/rentals/${rentalId}/return`)
            .set('Authorization', `Bearer ${renter.token}`);

        // Owner confirms receipt
        const res = await request(app)
            .put(`/api/rentals/${rentalId}/confirm-receipt`)
            .set('Authorization', `Bearer ${owner.token}`);

        expect(res.statusCode).toBe(200);

        // Verify: ESCROW RELEASED — owner gets the 200₺
        const ownerProfile = await request(app)
            .get('/api/user/profile')
            .set('Authorization', `Bearer ${owner.token}`);
        expect(parseFloat(ownerProfile.body.balance)).toBe(200);

        // Verify: item is back to available
        const itemRes = await request(app).get(`/api/items/${item.id}`);
        expect(itemRes.body.status).toBe('available');
    });

    it('should prevent return on a non-active rental', async () => {
        // Rental is still in pending_handover — cannot return yet
        const res = await request(app)
            .put(`/api/rentals/${rentalId}/return`)
            .set('Authorization', `Bearer ${renter.token}`);

        expect(res.statusCode).toBe(400);
    });

    it('should prevent confirm-receipt by non-owner', async () => {
        await request(app)
            .put(`/api/rentals/${rentalId}/confirm-handover`)
            .set('Authorization', `Bearer ${renter.token}`);
        await request(app)
            .put(`/api/rentals/${rentalId}/return`)
            .set('Authorization', `Bearer ${renter.token}`);

        // Renter (not owner) tries to confirm receipt
        const res = await request(app)
            .put(`/api/rentals/${rentalId}/confirm-receipt`)
            .set('Authorization', `Bearer ${renter.token}`);

        expect(res.statusCode).toBe(400); // falls through the "rental not found" check
    });
});

describe('POST /api/rentals/:id/dispute', () => {
    let owner, renter, rentalId;

    beforeEach(async () => {
        await truncateAll();
        owner = await createTestUser('DisputeOwner', 'disp_owner@test.com');
        renter = await createTestUser('DisputeRenter', 'disp_renter@test.com');
        await addFunds(renter.token, 500);
        const item = await createTestItem(owner.token, { title: 'Disputed Item' });
        await createRental(renter.token, item.id, 100);

        const rentals = await request(app)
            .get('/api/rentals/my-rentals')
            .set('Authorization', `Bearer ${renter.token}`);
        rentalId = rentals.body[0].id;
    });

    it('should allow involved party to raise a dispute', async () => {
        const res = await request(app)
            .post(`/api/rentals/${rentalId}/dispute`)
            .set('Authorization', `Bearer ${renter.token}`)
            .send({ reason: 'Item was damaged on delivery' });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/dispute raised/i);
    });

    it('should prevent duplicate open disputes', async () => {
        await request(app)
            .post(`/api/rentals/${rentalId}/dispute`)
            .set('Authorization', `Bearer ${renter.token}`)
            .send({ reason: 'First dispute' });

        const res = await request(app)
            .post(`/api/rentals/${rentalId}/dispute`)
            .set('Authorization', `Bearer ${renter.token}`)
            .send({ reason: 'Second attempt' });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/already open/i);
    });

    it('should block state transitions when dispute is open', async () => {
        // Activate the rental first
        await request(app)
            .put(`/api/rentals/${rentalId}/confirm-handover`)
            .set('Authorization', `Bearer ${renter.token}`);

        // Open a dispute
        await request(app)
            .post(`/api/rentals/${rentalId}/dispute`)
            .set('Authorization', `Bearer ${owner.token}`)
            .send({ reason: 'Item damaged!' });

        // Try to return — should be blocked by escrow freeze
        const res = await request(app)
            .put(`/api/rentals/${rentalId}/return`)
            .set('Authorization', `Bearer ${renter.token}`);

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/frozen|dispute/i);
    });

    it('should reject dispute from non-participant', async () => {
        const stranger = await createTestUser('Stranger', 'stranger@test.com');

        const res = await request(app)
            .post(`/api/rentals/${rentalId}/dispute`)
            .set('Authorization', `Bearer ${stranger.token}`)
            .send({ reason: 'I am not involved' });

        expect(res.statusCode).toBe(403);
    });
});
