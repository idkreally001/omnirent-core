const express = require('express');
const router = express.Router();
const pool = require('../../db');
const auth = require('../middleware/auth.middleware');

// GET /api/user/profile
// This is a PRIVATE route
router.get('/profile', auth, async (req, res) => {
    try {
        // req.user was set by our middleware bouncer
        const user = await pool.query(
            "SELECT id, full_name, email, created_at FROM users WHERE id = $1", 
            [req.user.id]
        );
        res.json(user.rows[0]);
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

module.exports = router;