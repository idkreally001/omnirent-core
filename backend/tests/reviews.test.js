const { app, request, pool, truncateAll, createTestUser, createTestItem, addFunds, createRental } = require('./helpers');

beforeEach(async () => {
    await truncateAll();
});

describe('POST /api/reviews', () => {
    let owner, renter, rentalId;

    // Helper: Run full lifecycle to 'completed'
    const completeRentalCycle = async () => {
        owner = await createTestUser('ReviewOwner', 'rev_owner@test.com');
        renter = await createTestUser('ReviewRenter', 'rev_renter@test.com');
        await addFunds(renter.token, 500);
        const item = await createTestItem(owner.token, { title: 'Reviewable Item' });
        await createRental(renter.token, item.id, 100);

        const rentals = await request(app)
            .get('/api/rentals/my-rentals')
            .set('Authorization', `Bearer ${renter.token}`);
        rentalId = rentals.body[0].id;

        // Complete full lifecycle: handover → return → confirm receipt
        await request(app)
            .put(`/api/rentals/${rentalId}/confirm-handover`)
            .set('Authorization', `Bearer ${renter.token}`);
        await request(app)
            .put(`/api/rentals/${rentalId}/return`)
            .set('Authorization', `Bearer ${renter.token}`);
        await request(app)
            .put(`/api/rentals/${rentalId}/confirm-receipt`)
            .set('Authorization', `Bearer ${owner.token}`);
    };

    it('should allow renter to review after completed rental', async () => {
        await completeRentalCycle();

        const res = await request(app)
            .post('/api/reviews')
            .set('Authorization', `Bearer ${renter.token}`)
            .send({ rentalId, rating: 5, comment: 'Great experience!' });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/review submitted/i);
    });

    it('should reject review on non-completed rental', async () => {
        owner = await createTestUser('IncOwner', 'inc_owner@test.com');
        renter = await createTestUser('IncRenter', 'inc_renter@test.com');
        await addFunds(renter.token, 500);
        const item = await createTestItem(owner.token, { title: 'Incomplete Rental Item' });
        await createRental(renter.token, item.id, 100);

        const rentals = await request(app)
            .get('/api/rentals/my-rentals')
            .set('Authorization', `Bearer ${renter.token}`);
        const incompleteRentalId = rentals.body[0].id;

        const res = await request(app)
            .post('/api/reviews')
            .set('Authorization', `Bearer ${renter.token}`)
            .send({ rentalId: incompleteRentalId, rating: 3, comment: 'Premature review' });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/completed/i);
    });

    it('should prevent duplicate reviews (unique constraint)', async () => {
        await completeRentalCycle();

        // First review — succeeds
        await request(app)
            .post('/api/reviews')
            .set('Authorization', `Bearer ${renter.token}`)
            .send({ rentalId, rating: 4, comment: 'First review' });

        // Second review — should fail
        const res = await request(app)
            .post('/api/reviews')
            .set('Authorization', `Bearer ${renter.token}`)
            .send({ rentalId, rating: 5, comment: 'Duplicate attempt' });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/already reviewed/i);
    });

    it('should reject review from non-participant', async () => {
        await completeRentalCycle();
        const stranger = await createTestUser('Stranger', 'stranger@test.com');

        const res = await request(app)
            .post('/api/reviews')
            .set('Authorization', `Bearer ${stranger.token}`)
            .send({ rentalId, rating: 1, comment: 'I was not part of this' });

        expect(res.statusCode).toBe(403);
    });
});

describe('GET /api/reviews/user/:userId', () => {
    it('should return reviews for a user', async () => {
        // Set up a completed rental + review
        const owner = await createTestUser('RevTarget', 'rev_target@test.com');
        const renter = await createTestUser('Reviewer', 'reviewer@test.com');
        await addFunds(renter.token, 500);
        const item = await createTestItem(owner.token, { title: 'Reviewed Item' });
        await createRental(renter.token, item.id, 100);

        const rentals = await request(app)
            .get('/api/rentals/my-rentals')
            .set('Authorization', `Bearer ${renter.token}`);
        const rentalId = rentals.body[0].id;

        // Complete lifecycle
        await request(app).put(`/api/rentals/${rentalId}/confirm-handover`).set('Authorization', `Bearer ${renter.token}`);
        await request(app).put(`/api/rentals/${rentalId}/return`).set('Authorization', `Bearer ${renter.token}`);
        await request(app).put(`/api/rentals/${rentalId}/confirm-receipt`).set('Authorization', `Bearer ${owner.token}`);

        // Leave review
        await request(app)
            .post('/api/reviews')
            .set('Authorization', `Bearer ${renter.token}`)
            .send({ rentalId, rating: 5, comment: 'Excellent owner!' });

        // Fetch reviews for owner
        const res = await request(app).get(`/api/reviews/user/${owner.user.id}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].rating).toBe(5);
        expect(res.body[0].reviewer_name).toBe('Reviewer');
    });
});
