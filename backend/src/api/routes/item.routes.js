const express = require('express');
const router = express.Router();
const pool = require('../../db');
const auth = require('../middleware/auth.middleware');

// 1. CREATE AN ITEM (Private)
router.post('/', auth, async (req, res) => {
    const { title, description, price, category } = req.body;
    try {
        const newItem = await pool.query(
            "INSERT INTO items (owner_id, title, description, price_per_day, category) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [req.user.id, title, description, price, category]
        );
        res.json(newItem.rows[0]);
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// 2. GET ALL ITEMS (Public - for the Browse page)
router.get('/', async (req, res) => {
    try {
        const items = await pool.query("SELECT * FROM items WHERE status = 'available'");
        res.json(items.rows);
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

module.exports = router;