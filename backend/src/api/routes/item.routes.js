const express = require('express');
const router = express.Router();
const pool = require('../../db');
const auth = require('../middleware/auth.middleware');

// 1. CREATE ITEM
router.post('/', auth, async (req, res) => {
    const { title, description, price, category, image_url, image_urls } = req.body; 
    try {
        const newItem = await pool.query(
            "INSERT INTO items (owner_id, title, description, price_per_day, category, image_url, image_urls) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [req.user.id, title, description, price, category, image_url, JSON.stringify(image_urls || [])]
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
    
    let queryText = `SELECT i.*, 
                    (SELECT tc_no IS NOT NULL FROM users WHERE id = i.owner_id) as owner_verified,
                    (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE target_user_id = i.owner_id) as owner_rating
                 FROM items i WHERE is_deleted = FALSE`;
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

// GET /api/items/:id (Updated to include Owner Trust)
router.get('/:id', async (req, res) => {
    try {
        const item = await pool.query(
            `SELECT i.*, u.full_name as owner_name, u.tc_no IS NOT NULL as owner_verified,
                    COALESCE(AVG(r.rating), 0) as owner_rating,
                    COUNT(r.id) as owner_reviews
             FROM items i
             JOIN users u ON i.owner_id = u.id
             LEFT JOIN reviews r ON u.id = r.target_user_id
             WHERE i.id = $1
             GROUP BY i.id, u.id`, [req.params.id]
        );
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

        if (item.owner_id !== req.user.id && !req.user.is_admin) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        // Strict check: Are there any unresolved rentals (or disputes) for this item?
        const activeRentals = await pool.query(
            "SELECT id FROM rentals WHERE item_id = $1 AND status != 'completed'",
            [req.params.id]
        );
        if (activeRentals.rows.length > 0) {
            return res.status(400).json({ error: "Cannot archive an item that is currently in a transaction or active dispute." });
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
             LEFT JOIN rentals r ON i.id = r.item_id AND r.status IN ('active', 'returned_by_renter', 'pending_handover')
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