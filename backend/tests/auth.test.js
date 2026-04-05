const { app, request, truncateAll, createTestUser } = require('./helpers');

beforeEach(async () => {
    await truncateAll();
});

describe('POST /api/auth/register', () => {
    it('should register a new user and return token', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ fullName: 'John Doe', email: 'john@test.com', password: 'Pass1234' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toHaveProperty('id');
        expect(res.body.user.full_name).toBe('John Doe');
        expect(res.body.user.email).toBe('john@test.com');
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
    beforeEach(async () => {
        await createTestUser('Login User', 'login@test.com', 'CorrectPass');
    });

    it('should login with correct credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'login@test.com', password: 'CorrectPass' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toHaveProperty('id');
    });

    it('should reject wrong password with 401', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'login@test.com', password: 'WrongPassword' });

        expect(res.statusCode).toBe(401);
        expect(res.body.error).toMatch(/invalid credentials/i);
    });

    it('should reject non-existent email with 401', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'ghost@test.com', password: 'Whatever' });

        expect(res.statusCode).toBe(401);
        expect(res.body.error).toMatch(/invalid credentials/i);
    });
});
