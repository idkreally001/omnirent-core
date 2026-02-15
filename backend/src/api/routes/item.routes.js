const express = require('express');
const router = express.Router();
const pool = require('../../db');
const auth = require('../middleware/auth.middleware');

// 1. CREATE ITEM
router.post('/', auth, async (req, res) => {
    const { title, description, price, category, image_url } = req.body; 
    try {
        const newItem = await pool.query(
            "INSERT INTO items (owner_id, title, description, price_per_day, category, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [req.user.id, title, description, price, category, image_url]
        );
        res.json(newItem.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// 2. GET ALL ITEMS (With Search, Filters, Sorting, and Price Range)
router.get('/', async (req, res) => {
    // Destructure new parameters from the query string
    const { search, category, sort, maxPrice } = req.query;
    
    let queryText = "SELECT * FROM items WHERE is_deleted = FALSE";
    let queryParams = [];
    let paramCount = 1;

    // Search Filter (Title or Description)
    if (search) {
        queryText += ` AND (title ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
        queryParams.push(`%${search}%`);
        paramCount++;
    }

    // Category Filter
    if (category && category !== 'All') {
        queryText += ` AND category = $${paramCount}`;
        queryParams.push(category);
        paramCount++;
    }

    // NEW: Price Range Filter
    if (maxPrice && !isNaN(maxPrice)) {
        queryText += ` AND price_per_day <= $${paramCount}`;
        queryParams.push(maxPrice);
        paramCount++;
    }

    // NEW: Sorting Logic
    // We build the ORDER BY clause based on the 'sort' parameter
    if (sort === 'price_asc') {
        queryText += " ORDER BY price_per_day ASC";
    } else if (sort === 'price_desc') {
        queryText += " ORDER BY price_per_day DESC";
    } else if (sort === 'oldest') {
        queryText += " ORDER BY created_at ASC";
    } else {
        // Default: Newest first
        queryText += " ORDER BY created_at DESC";
    }

    try {
        const items = await pool.query(queryText, queryParams);
        res.json(items.rows);
    } catch (err) {
        console.error("Discovery Error:", err.message);
        res.status(500).send("Server Error");
    }
});

// 3. GET SINGLE ITEM
router.get('/:id', async (req, res) => {
    try {
        const item = await pool.query(
            "SELECT items.*, users.full_name as owner_name FROM items JOIN users ON items.owner_id = users.id WHERE items.id = $1 AND items.is_deleted = FALSE", 
            [req.params.id]
        );
        if (item.rows.length === 0) return res.status(404).json({ error: "Item not found" });
        res.json(item.rows[0]);
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// 4. SOFT DELETE ITEM
router.delete('/:id', auth, async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM items WHERE id = $1", [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Item not found" });

        const item = result.rows[0];

        if (item.owner_id !== req.user.id) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        if (item.status === 'rented') {
            return res.status(400).json({ error: "Cannot delete item while it is currently rented." });
        }

        await pool.query("UPDATE items SET is_deleted = TRUE WHERE id = $1", [req.params.id]);
        res.json({ message: "Item archived successfully" });
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// 5. GET MY ITEMS (With Detailed Lending & Handshake Info)
router.get('/mine/all', auth, async (req, res) => {
    try {
        const myItems = await pool.query(
            `SELECT 
                i.*, 
                r.id as active_rental_id, 
                r.status as rental_status, 
                r.return_date, 
                u.full_name as renter_name 
             FROM items i 
             -- We join with rentals that are NOT completed to see current activity
             LEFT JOIN rentals r ON i.id = r.item_id AND r.status IN ('active', 'returned_by_renter')
             LEFT JOIN users u ON r.renter_id = u.id 
             WHERE i.owner_id = $1 
               AND i.is_deleted = FALSE 
             ORDER BY i.created_at DESC`, 
            [req.user.id]
        );
        res.json(myItems.rows);
    } catch (err) {
        console.error("Lending Logic Error:", err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;