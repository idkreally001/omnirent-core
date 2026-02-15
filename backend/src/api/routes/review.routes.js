const express = require('express');
const router = express.Router();
const pool = require('../../db');
const auth = require('../middleware/auth.middleware');

// POST /api/reviews -> Submit a review
router.post('/', auth, async (req, res) => {
    const { rentalId, rating, comment } = req.body;
    const reviewerId = req.user.id;

    try {
        // 1. Verify the rental exists, is completed, and the reviewer was a participant
        const rentalRes = await pool.query(
            `SELECT r.renter_id, i.owner_id, r.status 
             FROM rentals r 
             JOIN items i ON r.item_id = i.id 
             WHERE r.id = $1`,
            [rentalId]
        );

        if (rentalRes.rows.length === 0) return res.status(404).json({ error: "Rental not found" });
        
        const rental = rentalRes.rows[0];

        if (rental.status !== 'completed') {
            return res.status(400).json({ error: "Reviews can only be left for completed rentals." });
        }

        // 2. Determine who the "target" (reviewee) is
        let targetUserId;
        if (reviewerId === rental.renter_id) {
            targetUserId = rental.owner_id; // Renter rating Owner
        } else if (reviewerId === rental.owner_id) {
            targetUserId = rental.renter_id; // Owner rating Renter
        } else {
            return res.status(403).json({ error: "You were not part of this transaction." });
        }

        // 3. Insert the review (UNIQUE constraint in DB handles duplicates)
        await pool.query(
            `INSERT INTO reviews (rental_id, reviewer_id, target_user_id, rating, comment) 
             VALUES ($1, $2, $3, $4, $5)`,
            [rentalId, reviewerId, targetUserId, rating, comment]
        );

        res.json({ message: "Review submitted! Thank you for building trust in the community." });

    } catch (err) {
        if (err.code === '23505') { // Postgres Unique Violation
            return res.status(400).json({ error: "You have already reviewed this transaction." });
        }
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


// GET /api/reviews/user/:userId -> Fetch all reviews FOR a specific user
router.get('/user/:userId', async (req, res) => {
    try {
        const reviews = await pool.query(
            `SELECT r.*, u.full_name as reviewer_name 
             FROM reviews r
             JOIN users u ON r.reviewer_id = u.id
             WHERE r.target_user_id = $1
             ORDER BY r.created_at DESC`,
            [req.params.userId]
        );
        res.json(reviews.rows);
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

module.exports = router;