const { app, request, truncateAll, createTestUser, addFunds } = require('./helpers');

beforeEach(async () => {
    await truncateAll();
});

describe('GET /api/user/profile', () => {
    it('should reject requests without a token (401)', async () => {
        const res = await request(app).get('/api/user/profile');
        expect(res.statusCode).toBe(401);
    });

    it('should return user profile with a valid token', async () => {
        const { token } = await createTestUser('Profile User', 'profile@test.com');

        const res = await request(app)
            .get('/api/user/profile')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.full_name).toBe('Profile User');
        expect(res.body.email).toBe('profile@test.com');
        expect(res.body).toHaveProperty('balance');
    });
});

describe('POST /api/user/add-funds', () => {
    it('should increase the user balance', async () => {
        const { token } = await createTestUser('Wallet User', 'wallet@test.com');
        
        await addFunds(token, 250);
        
        const profile = await request(app)
            .get('/api/user/profile')
            .set('Authorization', `Bearer ${token}`);

        expect(parseFloat(profile.body.balance)).toBe(250);
    });
});

describe('DELETE /api/user/delete-account', () => {
    it('should return 400 (NOT 401) for wrong password — prevents auto-logout', async () => {
        const { token } = await createTestUser('Delete User', 'delete@test.com', 'RealPassword');

        const res = await request(app)
            .delete('/api/user/delete-account')
            .set('Authorization', `Bearer ${token}`)
            .send({ password: 'WrongPassword' });

        // THIS IS THE EXACT BUG WE CAUGHT:
        // If this returns 401, the frontend Axios interceptor auto-logs out the user.
        // It MUST be 400 so the error is shown in the modal instead.
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/incorrect password/i);
    });

    it('should delete account with correct password', async () => {
        const { token } = await createTestUser('Delete User', 'delete2@test.com', 'RealPassword');

        const res = await request(app)
            .delete('/api/user/delete-account')
            .set('Authorization', `Bearer ${token}`)
            .send({ password: 'RealPassword' });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/deleted/i);
    });

    it('should require password field', async () => {
        const { token } = await createTestUser('NoPass User', 'nopass@test.com', 'Pass123');

        const res = await request(app)
            .delete('/api/user/delete-account')
            .set('Authorization', `Bearer ${token}`)
            .send({}); // No password

        // bcrypt.compare with undefined will fail
        expect(res.statusCode).not.toBe(200);
    });
});

describe('GET /api/user/public/:id', () => {
    it('should return public profile for valid user', async () => {
        const { user } = await createTestUser('Public User', 'public@test.com');

        const res = await request(app).get(`/api/user/public/${user.id}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.user.full_name).toBe('Public User');
        // Should NOT expose email in public profile
        expect(res.body.user.email).toBeUndefined();
    });

    it('should return 404 for non-existent user', async () => {
        const res = await request(app).get('/api/user/public/99999');
        expect(res.statusCode).toBe(404);
    });

    it('should return 400 for invalid ID', async () => {
        const res = await request(app).get('/api/user/public/abc');
        expect(res.statusCode).toBe(400);
    });
});
