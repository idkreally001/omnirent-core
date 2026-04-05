const { app, request, truncateAll, createTestUser } = require('./helpers');

beforeEach(async () => {
    await truncateAll();
});

describe('POST /api/auth/register', () => {
    it('should register a new user and return success message', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ fullName: 'John Doe', email: 'john@test.com', password: 'Pass1234' });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/check your email/i);
        expect(res.body.user).toHaveProperty('id');
    });

    it('should reject duplicate email with 400', async () => {
        await createTestUser('Existing', 'dupe@test.com', 'Pass1234');

        const res = await request(app)
            .post('/api/auth/register')
            .send({ fullName: 'Another', email: 'dupe@test.com', password: 'Pass1234' });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/already exists/i);
    });
});

describe('POST /api/auth/login', () => {
    it('should login with verified credentials', async () => {
        await createTestUser('Verified User', 'login@test.com', 'CorrectPass');

        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'login@test.com', password: 'CorrectPass' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should reject unverified user with 403', async () => {
        // Create user manually via API so they remain UNVERIFIED
        await request(app)
            .post('/api/auth/register')
            .send({ fullName: 'Unverified', email: 'unverified@test.com', password: 'Pass1234' });

        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'unverified@test.com', password: 'Pass1234' });

        expect(res.statusCode).toBe(403);
        expect(res.body.error).toMatch(/not verified/i);
    });

    it('should reject wrong password with 401', async () => {
        await createTestUser('Pass Test', 'pass@test.com', 'CorrectPass');

        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'pass@test.com', password: 'WrongPassword' });

        expect(res.statusCode).toBe(401);
        expect(res.body.error).toMatch(/invalid credentials/i);
    });
});
