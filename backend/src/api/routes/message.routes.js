const express = require('express');
const router = express.Router();
const pool = require('../../db');
const auth = require('../middleware/auth.middleware');

// 1. GET /api/messages/conversations
// UPDATED: Now includes an 'unread_count' for each conversation
router.get('/conversations', auth, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT DISTINCT ON (other_user_id) 
                u.id as other_user_id, 
                u.full_name, 
                m.content as last_message, 
                m.created_at,
                (SELECT COUNT(*)::int FROM messages 
                 WHERE sender_id = u.id AND receiver_id = $1 AND read_at IS NULL) as unread_count
             FROM (
                SELECT sender_id as other_user_id, content, created_at FROM messages WHERE receiver_id = $1
                UNION
                SELECT receiver_id as other_user_id, content, created_at FROM messages WHERE sender_id = $1
             ) m
             JOIN users u ON m.other_user_id = u.id
             ORDER BY other_user_id, m.created_at DESC`,
            [req.user.id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// 2. GET /api/messages/:otherUserId
router.get('/:otherUserId', auth, async (req, res) => {
    try {
        const history = await pool.query(
            `SELECT * FROM messages 
             WHERE (sender_id = $1 AND receiver_id = $2) 
                OR (sender_id = $2 AND receiver_id = $1)
             ORDER BY created_at ASC`,
            [req.user.id, req.params.otherUserId]
        );
        res.json(history.rows);
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// 3. NEW: PUT /api/messages/read/:senderId
// Marks all messages from a specific user as "read"
router.put('/read/:senderId', auth, async (req, res) => {
    try {
        await pool.query(
            `UPDATE messages 
             SET read_at = NOW() 
             WHERE receiver_id = $1 AND sender_id = $2 AND read_at IS NULL`,
            [req.user.id, req.params.senderId]
        );

        // Notify the original sender that their messages were read
        if (req.io) {
            req.io.to(`user_${req.params.senderId}`).emit('messages_read', {
                readerId: req.user.id
            });
        }

        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// 4. POST /api/messages
router.post('/', auth, async (req, res) => {
    const { receiverId, itemId, content } = req.body;
    try {
        // Check if the receiver is currently focused on this specific chat
        // This matches the frontend logic: focus_${userId}_${otherId}
        const isFocused = req.io?.sockets.adapter.rooms.has(`focus_${receiverId}_${req.user.id}`);
        
        // If they are focused, we can set read_at immediately
        const readAt = isFocused ? 'NOW()' : null;

        const newMessage = await pool.query(
            `INSERT INTO messages (sender_id, receiver_id, item_id, content, read_at) 
             VALUES ($1, $2, $3, $4, ${isFocused ? 'NOW()' : 'NULL'}) 
             RETURNING *`,
            [req.user.id, receiverId, itemId, content]
        );

        const messageData = newMessage.rows[0];

        if (req.io) {
            req.io.to(`user_${receiverId}`).emit('new_message', messageData);

            if (!isFocused) {
                // User is NOT focused, send a notification
                const senderRes = await pool.query("SELECT full_name FROM users WHERE id = $1", [req.user.id]);
                const senderName = senderRes.rows[0]?.full_name || "Someone";
                
                const newNotif = await pool.query(
                    `INSERT INTO notifications (user_id, type, message, related_id) 
                     VALUES ($1, 'NEW_MESSAGE', $2, $3) RETURNING *`,
                    [receiverId, `New message from ${senderName}`, req.user.id] 
                );
                req.io.to(`user_${receiverId}`).emit('new_notification', newNotif.rows[0]);
            }
        }

        res.json(messageData);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

module.exports = router;