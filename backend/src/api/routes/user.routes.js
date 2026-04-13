const express = require('express');
const router = express.Router();
const pool = require('../../db');
const auth = require('../middleware/auth.middleware');
const bcrypt = require('bcryptjs');
const requireNotRestricted = require('../middleware/restricted.middleware');
const { verifyIdentity } = require('../../services/identity/identity.service');

// 1. GET Profile - FIXED to include tc_no
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await pool.query(
            `SELECT u.id, u.full_name, u.email, u.created_at, u.balance, u.tc_no, u.is_admin, u.is_restricted,
                    COALESCE(AVG(rev.rating), 0) as avg_rating,
                    COUNT(rev.id) as review_count,
                    (SELECT COALESCE(SUM(r.total_price), 0) FROM rentals r JOIN items i ON r.item_id = i.id WHERE i.owner_id = u.id AND r.status IN ('active', 'returned_by_renter')) as pending_escrow
             FROM users u
             LEFT JOIN reviews rev ON u.id = rev.target_user_id
             WHERE u.id = $1
             GROUP BY u.id`, 
            [req.user.id]
        );
        res.json(user.rows[0]);
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// 2. GET Public Profile (for other users to view) - NEW
router.get('/public/:id', async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid User Profile ID." });
    }

    try {
        const profile = await pool.query(
            `SELECT u.id, u.full_name, u.created_at, u.tc_no,
                    COALESCE(AVG(rev.rating), 0) as avg_rating,
                    COUNT(rev.id) as review_count
             FROM users u
             LEFT JOIN reviews rev ON u.id = rev.target_user_id
             WHERE u.id = $1
             GROUP BY u.id`, [userId]
        );
        
        if (profile.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const reviews = await pool.query(
            `SELECT r.rating, r.comment, r.created_at, u.full_name as reviewer_name
             FROM reviews r
             JOIN users u ON r.reviewer_id = u.id
             WHERE r.target_user_id = $1
             ORDER BY r.created_at DESC`, [userId]
        );

        res.json({ user: profile.rows[0], reviews: reviews.rows });
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// PUT Verify Identity
router.put('/verify', auth, requireNotRestricted, async (req, res) => {
    const { tc_no } = req.body;

    if (!tc_no || tc_no.length !== 11) {
        return res.status(400).json({ error: "A valid 11-digit TC number is required." });
    }

    try {
        // --- Fetch full_name from DB (JWT payload does not carry it) ---
        const userRecord = await pool.query("SELECT full_name FROM users WHERE id = $1", [req.user.id]);
        if (userRecord.rows.length === 0) return res.status(404).json({ error: "User not found." });
        const fullName = userRecord.rows[0].full_name;

        // --- TCKN Uniqueness Check ---
        const existing = await pool.query("SELECT id FROM users WHERE tc_no = $1 AND id != $2", [tc_no, req.user.id]);
        if (existing.rows.length > 0) {
            return res.status(400).json({ error: "This Identity Number is already verified with another account." });
        }

        const verificationResult = await verifyIdentity(fullName, tc_no);
        
        // Since your mock returns { success: true, status: '...' }
        if (!verificationResult.success) {
            return res.status(400).json({ 
                error: verificationResult.message || "Identity verification failed." 
            });
        }

        // Finalize: Update the user record with the now-verified TC number
        await pool.query(
            "UPDATE users SET tc_no = $1 WHERE id = $2",
            [tc_no, req.user.id]
        );

        res.json({ 
            message: "Identity verified successfully!", 
            status: verificationResult.status 
        });
    } catch (err) {
        console.error("Verification Route Error:", err.message);
        res.status(500).json({ error: "Identity verification service is temporarily offline." });
    }
});

// 3. POST Add Funds
router.post('/add-funds', auth, async (req, res) => {
    const { amount } = req.body;
    try {
        await pool.query(
            "UPDATE users SET balance = balance + $1 WHERE id = $2",
            [amount, req.user.id]
        );
        res.json({ message: "Funds added successfully" });
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// 4. DELETE Account (Keep your existing bcrypt logic here)
router.delete('/delete-account', auth, async (req, res) => {
    const { password } = req.body;
    try {
        const userResult = await pool.query("SELECT * FROM users WHERE id = $1", [req.user.id]);
        if (userResult.rows.length === 0) return res.status(404).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, userResult.rows[0].password_hash);
        if (!isMatch) return res.status(400).json({ error: "Incorrect password." });

        await pool.query("DELETE FROM users WHERE id = $1", [req.user.id]);
        res.json({ message: "Account deleted." });
    } catch (err) {
        res.status(500).send("Server Error");
    }
});


// GET /api/user/my-reviews (Reviews left for ME)
router.get('/my-reviews', auth, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT r.rating, r.comment, r.created_at, u.full_name as reviewer_name
             FROM reviews r
             JOIN users u ON r.reviewer_id = u.id
             WHERE r.target_user_id = $1
             ORDER BY r.created_at DESC`,
            [req.user.id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// POST /api/user/escalate (Become Admin using a secret key)
router.post('/escalate', auth, async (req, res) => {
    const { secret } = req.body;
    
    const validSecret = process.env.ADMIN_SECRET;
    
    // Server misconfiguration defense: do not allow escalation if no secret is set
    if (!validSecret) {
        return res.status(500).json({ error: "Administrator escalation is not configured on this server." });
    }
    
    if (secret !== validSecret) {
        return res.status(401).json({ error: "Invalid administrator secret key." });
    }

    try {
        await pool.query("UPDATE users SET is_admin = true WHERE id = $1", [req.user.id]);
        res.json({ message: "Privileges escalated. You are now an Administrator." });
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

module.exports = router;