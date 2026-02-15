const express = require('express');
const router = express.Router();
const pool = require('../../db');
const auth = require('../middleware/auth.middleware');

// 1. GET ALL NOTIFICATIONS (Unread first)
router.get('/', auth, async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM notifications WHERE user_id = $1 ORDER BY is_read ASC, created_at DESC",
            [req.user.id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// 2. MARK AS READ
router.put('/:id/read', auth, async (req, res) => {
    try {
        await pool.query(
            "UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2",
            [req.params.id, req.user.id]
        );
        res.json({ message: "Notification marked as read" });
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// 3. DELETE ALL READ NOTIFICATIONS (Cleanup)
router.delete('/cleanup', auth, async (req, res) => {
    try {
        await pool.query(
            "DELETE FROM notifications WHERE user_id = $1 AND is_read = TRUE",
            [req.user.id]
        );
        res.json({ message: "History cleared" });
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

module.exports = router;