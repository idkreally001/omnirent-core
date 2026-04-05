const { app, request, pool, truncateAll, createTestUser } = require('./helpers');

beforeEach(async () => {
    await truncateAll();
});

describe('GET /api/notifications', () => {
    it('should return notifications for authenticated user', async () => {
        const { token, user } = await createTestUser('NotifUser', 'notif@test.com');

        // Manually insert a notification
        await pool.query(
            "INSERT INTO notifications (user_id, type, message) VALUES ($1, $2, $3)",
            [user.id, 'TEST', 'Test notification']
        );

        const res = await request(app)
            .get('/api/notifications')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].message).toBe('Test notification');
        expect(res.body[0].is_read).toBe(false);
    });

    it('should reject without auth', async () => {
        const res = await request(app).get('/api/notifications');
        expect(res.statusCode).toBe(401);
    });
});

describe('PUT /api/notifications/read-all', () => {
    it('should mark all notifications as read', async () => {
        const { token, user } = await createTestUser('ReadAllUser', 'readall@test.com');

        await pool.query(
            "INSERT INTO notifications (user_id, type, message) VALUES ($1, 'A', 'msg1'), ($1, 'B', 'msg2')",
            [user.id]
        );

        const res = await request(app)
            .put('/api/notifications/read-all')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);

        // Verify all are read
        const notifs = await request(app)
            .get('/api/notifications')
            .set('Authorization', `Bearer ${token}`);

        notifs.body.forEach(n => expect(n.is_read).toBe(true));
    });
});

describe('PUT /api/notifications/:id/read', () => {
    it('should mark a single notification as read', async () => {
        const { token, user } = await createTestUser('SingleRead', 'single@test.com');

        const inserted = await pool.query(
            "INSERT INTO notifications (user_id, type, message) VALUES ($1, 'TEST', 'Single read test') RETURNING id",
            [user.id]
        );
        const notifId = inserted.rows[0].id;

        const res = await request(app)
            .put(`/api/notifications/${notifId}/read`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
    });
});

describe('DELETE /api/notifications/cleanup', () => {
    it('should delete only read notifications', async () => {
        const { token, user } = await createTestUser('Cleaner', 'cleaner@test.com');

        // Insert one read and one unread
        await pool.query(
            "INSERT INTO notifications (user_id, type, message, is_read) VALUES ($1, 'A', 'read msg', true), ($1, 'B', 'unread msg', false)",
            [user.id]
        );

        const res = await request(app)
            .delete('/api/notifications/cleanup')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);

        // Only the unread one should remain
        const remaining = await request(app)
            .get('/api/notifications')
            .set('Authorization', `Bearer ${token}`);

        expect(remaining.body.length).toBe(1);
        expect(remaining.body[0].message).toBe('unread msg');
    });
});
