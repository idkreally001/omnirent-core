const express = require('express');
const router = express.Router();
const pool = require('../../db');
const auth = require('../middleware/auth.middleware');
const bcrypt = require('bcryptjs');
const { verifyIdentity } = require('../../services/identity/identity.service');

// 1. GET Profile - FIXED to include tc_no
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await pool.query(
            "SELECT id, full_name, email, created_at, balance, tc_no FROM users WHERE id = $1", 
            [req.user.id]
        );
        res.json(user.rows[0]);
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// PUT Verify Identity
router.put('/verify', auth, async (req, res) => {
    const { tc_no } = req.body;

    if (!tc_no || tc_no.length !== 11) {
        return res.status(400).json({ error: "A valid 11-digit TC number is required." });
    }

    try {
        // We pass fullName first, then tcNo, as per your service definition
        const verificationResult = await verifyIdentity(req.user.full_name, tc_no);
        
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
        if (!isMatch) return res.status(401).json({ error: "Incorrect password." });

        await pool.query("DELETE FROM users WHERE id = $1", [req.user.id]);
        res.json({ message: "Account deleted." });
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

module.exports = router;