const express = require('express');
const router = express.Router();
const pool = require('../../db');
const auth = require('../middleware/auth.middleware');
const bcrypt = require('bcryptjs');

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


// DELETE Account (Verified)
router.delete('/delete-account', auth, async (req, res) => {
    const { password } = req.body;
    try {
        // 1. Get user from DB
        const user = await pool.query("SELECT * FROM users WHERE id = $1", [req.user.id]);
        
        // 2. Verify Password
        const isMatch = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: "Incorrect password. Authorization denied." });
        }

        // 3. Delete user (Cascade will handle their items)
        await pool.query("DELETE FROM users WHERE id = $1", [req.user.id]);
        res.json({ message: "Account deleted successfully." });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;