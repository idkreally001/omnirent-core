const express = require('express');
const router = express.Router();
const pool = require('../../db');
const auth = require('../middleware/auth.middleware');

// 1. CREATE AN ITEM (Private)
router.post('/', auth, async (req, res) => {
    // 1. Destructure image_url from the request body
    const { title, description, price, category, image_url } = req.body; 
    
    try {
        const newItem = await pool.query(
            // 2. Add image_url to columns and $6 to VALUES
            "INSERT INTO items (owner_id, title, description, price_per_day, category, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [req.user.id, title, description, price, category, image_url]
        );
        res.json(newItem.rows[0]);
    } catch (err) {
        console.error("Backend Error:", err.message); // Helpful for debugging
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


// 3. GET SINGLE ITEM (Public)
router.get('/:id', async (req, res) => {
    try {
        const item = await pool.query(
            "SELECT items.*, users.full_name as owner_name, users.email as owner_email FROM items JOIN users ON items.owner_id = users.id WHERE items.id = $1", 
            [req.params.id]
        );
        
        if (item.rows.length === 0) {
            return res.status(404).json({ error: "Item not found" });
        }
        
        res.json(item.rows[0]);
    } catch (err) {
        res.status(500).send("Server Error");
    }
});


// 4. DELETE AN ITEM (Private - Owner Only)
router.delete('/:id', auth, async (req, res) => {
    try {
        const item = await pool.query("SELECT * FROM items WHERE id = $1", [req.params.id]);

        if (item.rows.length === 0) {
            return res.status(404).json({ error: "Item not found" });
        }

        // Security Check: Does the user actually own this item?
        if (item.rows[0].owner_id !== req.user.id) {
            return res.status(403).json({ error: "Unauthorized to delete this item" });
        }

        await pool.query("DELETE FROM items WHERE id = $1", [req.params.id]);
        res.json({ message: "Item deleted successfully" });
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// 5. GET LOGGED-IN USER'S ITEMS (Private)
router.get('/mine/all', auth, async (req, res) => {
    try {
        const myItems = await pool.query(
            "SELECT * FROM items WHERE owner_id = $1 ORDER BY created_at DESC", 
            [req.user.id]
        );
        res.json(myItems.rows);
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

module.exports = router;