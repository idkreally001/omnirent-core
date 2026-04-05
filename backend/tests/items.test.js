const { app, request, truncateAll, createTestUser, createTestItem } = require('./helpers');

beforeEach(async () => {
    await truncateAll();
});

describe('POST /api/items', () => {
    it('should create an item for an authenticated user', async () => {
        const { token } = await createTestUser('Owner', 'owner@test.com');

        const res = await request(app)
            .post('/api/items')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Power Drill',
                description: 'Brand new drill',
                price: 75,
                category: 'Tools',
                image_url: 'https://example.com/drill.jpg'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe('Power Drill');
        expect(parseFloat(res.body.price_per_day)).toBe(75);
        expect(res.body.status).toBe('available');
    });

    it('should reject item creation without auth', async () => {
        const res = await request(app)
            .post('/api/items')
            .send({ title: 'Sneaky Item', description: 'no auth', price: 10 });

        expect(res.statusCode).toBe(401);
    });
});

describe('GET /api/items', () => {
    it('should return all non-deleted items', async () => {
        const { token } = await createTestUser('Lister', 'lister@test.com');
        await createTestItem(token, { title: 'Item A' });
        await createTestItem(token, { title: 'Item B' });

        const res = await request(app).get('/api/items');

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(2);
    });

    it('should filter items by search query', async () => {
        const { token } = await createTestUser('Searcher', 'search@test.com');
        await createTestItem(token, { title: 'Garden Hose' });
        await createTestItem(token, { title: 'Power Drill' });

        const res = await request(app).get('/api/items?search=drill');

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].title).toBe('Power Drill');
    });

    it('should filter items by category', async () => {
        const { token } = await createTestUser('CatUser', 'cat@test.com');
        await createTestItem(token, { title: 'Hammer', category: 'Tools' });
        await createTestItem(token, { title: 'Camera', category: 'Electronics' });

        const res = await request(app).get('/api/items?category=Electronics');

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].title).toBe('Camera');
    });

    it('should filter items by max price', async () => {
        const { token } = await createTestUser('PriceUser', 'price@test.com');
        await createTestItem(token, { title: 'Cheap', price: 20 });
        await createTestItem(token, { title: 'Expensive', price: 200 });

        const res = await request(app).get('/api/items?maxPrice=50');

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].title).toBe('Cheap');
    });
});

describe('GET /api/items/:id', () => {
    it('should return item details with owner info', async () => {
        const { token } = await createTestUser('DetailOwner', 'detail@test.com');
        const item = await createTestItem(token, { title: 'Detail Item' });

        const res = await request(app).get(`/api/items/${item.id}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe('Detail Item');
        expect(res.body.owner_name).toBe('DetailOwner');
    });
});

describe('DELETE /api/items/:id', () => {
    it('should soft-delete an item owned by the user', async () => {
        const { token } = await createTestUser('Deleter', 'deleter@test.com');
        const item = await createTestItem(token, { title: 'To Delete' });

        const res = await request(app)
            .delete(`/api/items/${item.id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);

        // Item should no longer appear in public listing
        const listing = await request(app).get('/api/items');
        expect(listing.body.find(i => i.id === item.id)).toBeUndefined();
    });

    it('should reject deletion by non-owner (403)', async () => {
        const owner = await createTestUser('RealOwner', 'real@test.com');
        const intruder = await createTestUser('Intruder', 'intruder@test.com');
        const item = await createTestItem(owner.token, { title: 'Protected Item' });

        const res = await request(app)
            .delete(`/api/items/${item.id}`)
            .set('Authorization', `Bearer ${intruder.token}`);

        expect(res.statusCode).toBe(403);
    });
});
