const { app, request, truncateAll, createTestUser } = require('./helpers');

beforeEach(async () => {
    await truncateAll();
});

describe('POST /api/messages', () => {
    it('should send a message between two users', async () => {
        const sender = await createTestUser('Sender', 'sender@test.com');
        const receiver = await createTestUser('Receiver', 'receiver@test.com');

        const res = await request(app)
            .post('/api/messages')
            .set('Authorization', `Bearer ${sender.token}`)
            .send({ receiverId: receiver.user.id, content: 'Hello there!', itemId: null });

        expect(res.statusCode).toBe(200);
        expect(res.body.content).toBe('Hello there!');
        expect(res.body.sender_id).toBe(sender.user.id);
        expect(res.body.receiver_id).toBe(receiver.user.id);
    });

    it('should reject messages without authentication', async () => {
        const res = await request(app)
            .post('/api/messages')
            .send({ receiverId: 1, content: 'Sneaky msg' });

        expect(res.statusCode).toBe(401);
    });
});

describe('GET /api/messages/:otherUserId', () => {
    it('should return message history between two users', async () => {
        const userA = await createTestUser('Alice', 'alice@test.com');
        const userB = await createTestUser('Bob', 'bob@test.com');

        // Send messages in both directions
        await request(app)
            .post('/api/messages')
            .set('Authorization', `Bearer ${userA.token}`)
            .send({ receiverId: userB.user.id, content: 'Hey Bob!' });
        await request(app)
            .post('/api/messages')
            .set('Authorization', `Bearer ${userB.token}`)
            .send({ receiverId: userA.user.id, content: 'Hey Alice!' });

        const res = await request(app)
            .get(`/api/messages/${userB.user.id}`)
            .set('Authorization', `Bearer ${userA.token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(2);
        expect(res.body[0].content).toBe('Hey Bob!');
        expect(res.body[1].content).toBe('Hey Alice!');
    });
});

describe('GET /api/messages/conversations', () => {
    it('should return list of conversations with unread counts', async () => {
        const userA = await createTestUser('ConvA', 'conva@test.com');
        const userB = await createTestUser('ConvB', 'convb@test.com');

        await request(app)
            .post('/api/messages')
            .set('Authorization', `Bearer ${userB.token}`)
            .send({ receiverId: userA.user.id, content: 'Unread msg 1' });
        await request(app)
            .post('/api/messages')
            .set('Authorization', `Bearer ${userB.token}`)
            .send({ receiverId: userA.user.id, content: 'Unread msg 2' });

        const res = await request(app)
            .get('/api/messages/conversations')
            .set('Authorization', `Bearer ${userA.token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
        // userA should have 2 unread messages from userB
        const convWithB = res.body.find(c => c.other_user_id === userB.user.id);
        expect(convWithB).toBeDefined();
        expect(convWithB.unread_count).toBe(2);
    });
});

describe('PUT /api/messages/read/:senderId', () => {
    it('should mark messages as read', async () => {
        const sender = await createTestUser('ReadSender', 'rsender@test.com');
        const reader = await createTestUser('Reader', 'reader@test.com');

        await request(app)
            .post('/api/messages')
            .set('Authorization', `Bearer ${sender.token}`)
            .send({ receiverId: reader.user.id, content: 'Read me' });

        const res = await request(app)
            .put(`/api/messages/read/${sender.user.id}`)
            .set('Authorization', `Bearer ${reader.token}`);

        expect(res.statusCode).toBe(200);

        // Verify: unread count should be 0 now
        const convos = await request(app)
            .get('/api/messages/conversations')
            .set('Authorization', `Bearer ${reader.token}`);
        const conv = convos.body.find(c => c.other_user_id === sender.user.id);
        expect(conv.unread_count).toBe(0);
    });
});
