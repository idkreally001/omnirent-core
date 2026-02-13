const express = require('express');
const router = express.Router();
const pool = require('../../db');
const auth = require('../middleware/auth.middleware');

// POST /api/rentals -> The "Rent Now" Logic
router.post('/', auth, async (req, res) => {
    const { itemId, returnDate, totalPrice } = req.body;
    const renterId = req.user.id;

    const client = await pool.connect();

    try {
        await client.query('BEGIN'); // Start transaction

        // 1. Verification: Is it available?
        const itemCheck = await client.query(
            "SELECT owner_id, status FROM items WHERE id = $1",
            [itemId]
        );

        if (itemCheck.rows.length === 0) {
            throw new Error("Item not found");
        }

        const item = itemCheck.rows[0];

        // 2. Logic Check: Don't rent your own item
        if (item.owner_id === renterId) {
            throw new Error("You cannot rent your own item!");
        }

        // 3. Status Check: Is it already taken?
        if (item.status !== 'available') {
            throw new Error("This item is already rented by someone else.");
        }

        // 4. Create the Rental
        await client.query(
            "INSERT INTO rentals (item_id, renter_id, return_date, total_price) VALUES ($1, $2, $3, $4)",
            [itemId, renterId, returnDate, totalPrice]
        );

        // 5. Update Item Status
        await client.query(
            "UPDATE items SET status = 'rented' WHERE id = $1",
            [itemId]
        );

        await client.query('COMMIT'); // Save changes
        res.json({ message: "Rental successful!" });

    } catch (err) {
        await client.query('ROLLBACK'); // Undo everything on error
        res.status(400).json({ error: err.message });
    } finally {
        client.release();
    }
});



// GET /api/rentals/my-rentals -> Items I am currently renting
router.get('/my-rentals', auth, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT r.*, i.title, i.image_url, i.category 
             FROM rentals r
             JOIN items i ON r.item_id = i.id
             WHERE r.renter_id = $1
             ORDER BY r.created_at DESC`,
            [req.user.id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;