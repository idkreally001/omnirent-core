const express = require('express');
const router = express.Router();
const pool = require('../../db');
const auth = require('../middleware/auth.middleware');
const adminAuth = require('../middleware/admin.middleware');

// 1. Get all open and resolved disputes
router.get('/disputes', auth, adminAuth, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT d.id, d.reason, d.status, d.resolution, d.admin_notes, d.created_at,
                    r.id as rental_id, r.total_price, r.status as rental_status,
                    i.title as item_title,
                    u_owner.id as owner_id, u_owner.full_name as owner_name,
                    u_renter.id as renter_id, u_renter.full_name as renter_name,
                    u_raiser.full_name as raiser_name
             FROM disputes d
             JOIN rentals r ON d.rental_id = r.id
             JOIN items i ON r.item_id = i.id
             JOIN users u_owner ON i.owner_id = u_owner.id
             JOIN users u_renter ON r.renter_id = u_renter.id
             JOIN users u_raiser ON d.raised_by = u_raiser.id
             ORDER BY CASE WHEN d.status = 'open' THEN 1 ELSE 2 END, d.created_at DESC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error fetching disputes");
    }
});

// 2. Resolve Dispute
router.put('/disputes/:id/resolve', auth, adminAuth, async (req, res) => {
    const { resolution, admin_notes } = req.body; 
    
    try {
        // Wrap in transaction for safety in case of logical expansions
        await pool.query('BEGIN');
        
        const disputeRes = await pool.query("SELECT * FROM disputes WHERE id = $1", [req.params.id]);
        if (disputeRes.rows.length === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).json({ error: "Dispute not found" });
        }

        await pool.query(
            "UPDATE disputes SET status = 'closed', resolution = $1, admin_notes = $2 WHERE id = $3",
            [resolution, admin_notes, req.params.id]
        );
        
        // Escrow Resolution Logic
        const rentalCheck = await pool.query(
            "SELECT r.total_price, r.renter_id, r.item_id, i.owner_id FROM rentals r JOIN items i ON r.item_id = i.id WHERE r.id = $1", 
            [disputeRes.rows[0].rental_id]
        );
        const { total_price, renter_id, item_id, owner_id } = rentalCheck.rows[0];

        if (resolution === 'refund_renter') {
            await pool.query("UPDATE users SET balance = balance + $1 WHERE id = $2", [total_price, renter_id]);
        } else if (resolution === 'pay_owner') {
            await pool.query("UPDATE users SET balance = balance + $1 WHERE id = $2", [total_price, owner_id]);
        }
        
        // Let's close the rental as well to clear it out of active buckets, and restore the item to available
        await pool.query("UPDATE rentals SET status = 'completed' WHERE id = $1", [disputeRes.rows[0].rental_id]);
        await pool.query("UPDATE items SET status = 'available' WHERE id = $1", [item_id]);

        await pool.query('COMMIT');
        res.json({ message: "Dispute resolved successfully. Escrow funds have been distributed." });
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error(err);
        res.status(500).send("Server Error resolving dispute");
    }
});

// 3. Get Rental Evidence (for Admins visually comparing pre/post conditions)
router.get('/disputes/:id/evidence', auth, adminAuth, async (req, res) => {
    try {
        const disputeRes = await pool.query("SELECT rental_id FROM disputes WHERE id = $1", [req.params.id]);
        if (disputeRes.rows.length === 0) return res.status(404).json({ error: "Dispute not found" });

        const rentalId = disputeRes.rows[0].rental_id;

        const evidence = await pool.query(
            "SELECT * FROM rental_evidence WHERE rental_id = $1 ORDER BY created_at ASC", 
            [rentalId]
        );
        res.json(evidence.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error fetching evidence");
    }
});

// 4. Get all users for moderation
router.get('/users', auth, adminAuth, async (req, res) => {
    try {
        const users = await pool.query(
            "SELECT id, full_name, email, tc_no, created_at, is_admin, is_banned, is_email_verified FROM users ORDER BY created_at DESC"
        );
        res.json(users.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error fetching users");
    }
});

// 5. Toggle User Ban Status
router.put('/users/:id/ban', auth, adminAuth, async (req, res) => {
    const { is_banned } = req.body;
    try {
        // Find user first
        const userCheck = await pool.query("SELECT * FROM users WHERE id = $1", [req.params.id]);
        if (userCheck.rows.length === 0) return res.status(404).json({ error: "User not found" });
        if (userCheck.rows[0].is_admin) return res.status(403).json({ error: "Cannot ban an admin account" });

        await pool.query("UPDATE users SET is_banned = $1 WHERE id = $2", [is_banned, req.params.id]);

        // If banned, automatically force their listings to invisible? Not strictly necessary if we block them from logging in, but good for completeness:
        if (is_banned) {
            await pool.query("UPDATE items SET is_deleted = TRUE WHERE owner_id = $1", [req.params.id]);
        }

        res.json({ message: `User has been successfully ${is_banned ? 'banned' : 'unbanned'}.` });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error toggling ban status");
    }
});

module.exports = router;
