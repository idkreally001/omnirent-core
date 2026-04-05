const express = require('express');
const router = express.Router();
const pool = require('../../db');
const auth = require('../middleware/auth.middleware');

// POST /api/rentals
router.post('/', auth, async (req, res) => {
    const { itemId, returnDate, totalPrice } = req.body;
    const renterId = req.user.id; // From middleware
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Fetch Item Title, Owner ID, AND the Renter's Full Name
        const dataRes = await client.query(
            `SELECT i.owner_id, i.status, i.title, u.full_name as renter_name 
             FROM items i 
             JOIN users u ON u.id = $2 
             WHERE i.id = $1`, 
            [itemId, renterId]
        );
        
        if (dataRes.rows.length === 0) throw new Error("Item or User not found");
        const { owner_id, status, title, renter_name } = dataRes.rows[0];

        // 2. Checks
        if (owner_id === renterId) throw new Error("Cannot rent your own item");
        if (status !== 'available') throw new Error("Item is not available");

        // 3. Wallet Logic (Fetch & Lock)
        const renterRes = await client.query("SELECT balance FROM users WHERE id = $1 FOR UPDATE", [renterId]);
        const renterBalance = parseFloat(renterRes.rows[0].balance);
        if (renterBalance < totalPrice) throw new Error(`Insufficient funds.`);

        // 4. Money Transfer (ESCROW)
        // Deduct from renter. We DO NOT add to owner yet (held in system escrow implicitly).
        await client.query("UPDATE users SET balance = balance - $1 WHERE id = $2", [totalPrice, renterId]);

        // 5. Create Rental & Update Item
        const rentalRes = await client.query(
            "INSERT INTO rentals (item_id, renter_id, return_date, total_price, status) VALUES ($1, $2, $3, $4, 'pending_handover') RETURNING id",
            [itemId, renterId, returnDate, totalPrice]
        );
        // We set item status to 'rented' immediately to remove it from catalog
        await client.query("UPDATE items SET status = 'rented' WHERE id = $1", [itemId]);

        // 6. Notify the Owner (renter_name is now properly fetched from DB)
        const ownerNotificationMsg = `Great news! Your "${title}" has been rented by ${renter_name}.`;
        await client.query(
            "INSERT INTO notifications (user_id, type, message, related_id) VALUES ($1, $2, $3, $4)",
            [owner_id, 'ITEM_RENTED', ownerNotificationMsg, rentalRes.rows[0].id]
        );

        await client.query('COMMIT');
        res.json({ message: "Rental successful!" });

    } catch (err) {
        await client.query('ROLLBACK');
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

// 0. RENTER: Confirms they physically received the item (Handover)
router.put('/:id/confirm-handover', auth, async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const rental = await client.query(
            "SELECT * FROM rentals WHERE id = $1 AND renter_id = $2 AND status = 'pending_handover'",
            [req.params.id, req.user.id]
        );

        if (rental.rows.length === 0) throw new Error("Rental not found or not in 'pending_handover' state.");

        // Update rental to 'active'
        await client.query(
            "UPDATE rentals SET status = 'active' WHERE id = $1",
            [req.params.id]
        );

        await client.query('COMMIT');
        res.json({ message: "Handover confirmed! Your rental is now active." });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(400).json({ error: err.message });
    } finally {
        client.release();
    }
});



// 1. RENTER: Notifies the owner "I have dropped it off/returned it"
router.put('/:id/return', auth, async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        // Check if the person returning is actually the renter
        const rental = await client.query(
            "SELECT * FROM rentals WHERE id = $1 AND renter_id = $2 AND status = 'active'",
            [req.params.id, req.user.id]
        );

        if (rental.rows.length === 0) throw new Error("Active rental not found or unauthorized.");

        // Update rental to 'returned_by_renter'
        await client.query(
            "UPDATE rentals SET status = 'returned_by_renter' WHERE id = $1",
            [req.params.id]
        );

        await client.query('COMMIT');
        res.json({ message: "Return initiated. Waiting for owner to confirm receipt." });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(400).json({ error: err.message });
    } finally {
        client.release();
    }
});

// 2. OWNER: Confirms they actually got the item back
router.put('/:id/confirm-receipt', auth, async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Verify the user owns the item and GET the renter_id for the notification
        const rentalCheck = await client.query(
            `SELECT r.id, r.item_id, r.renter_id, i.owner_id 
             FROM rentals r 
             JOIN items i ON r.item_id = i.id 
             WHERE r.id = $1 AND r.status = 'returned_by_renter'`,
            [req.params.id]
        );

        if (rentalCheck.rows.length === 0) throw new Error("Rental not found or not in 'returned' state.");
        
        // Destructure the data from the query result
        const { item_id, renter_id, owner_id } = rentalCheck.rows[0];

        if (owner_id !== req.user.id) return res.status(403).json({ error: "Unauthorized" });

        // Get Escrow Funds
        const rentDetails = await client.query("SELECT total_price FROM rentals WHERE id = $1", [req.params.id]);
        const escrowAmount = rentDetails.rows[0].total_price;

        // Finalize: Release Escrow to Owner
        await client.query("UPDATE users SET balance = balance + $1 WHERE id = $2", [escrowAmount, owner_id]);
        
        // Finalize: Rental is completed, Item is available again
        await client.query("UPDATE rentals SET status = 'completed' WHERE id = $1", [req.params.id]);
        await client.query("UPDATE items SET status = 'available' WHERE id = $1", [item_id]);

        // Trigger Notification for the Renter (renter_id is now defined!)
        const notificationMsg = `Your return for item #${item_id} has been confirmed! Please rate the owner.`;
        await client.query(
            "INSERT INTO notifications (user_id, type, message, related_id) VALUES ($1, $2, $3, $4)",
            [renter_id, 'RETURN_CONFIRMED', notificationMsg, req.params.id]
        );

        await client.query('COMMIT');
        res.json({ message: "Return confirmed! Item is back on the market." });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(400).json({ error: err.message });
    } finally {
        client.release();
    }
});



// GET /api/rentals/my-lendings -> Items I have lent to others (Current & Past)
router.get('/my-lendings', auth, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT r.*, i.title, i.image_url, u.full_name as renter_name 
             FROM rentals r
             JOIN items i ON r.item_id = i.id
             JOIN users u ON r.renter_id = u.id
             WHERE i.owner_id = $1
             ORDER BY r.created_at DESC`,
            [req.user.id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Lending History Error:", err.message);
        res.status(500).send("Server Error");
    }
});

// POST /api/rentals/:id/evidence -> Upload pre-flight / post-flight condition images
router.post('/:id/evidence', auth, async (req, res) => {
    let { images, stage } = req.body;
    if (!images || !Array.isArray(images) || images.length === 0) {
        return res.status(400).json({ error: "No images provided" });
    }
    if (!['handover', 'return'].includes(stage)) {
        return res.status(400).json({ error: "Invalid stage. Must be 'handover' or 'return'" });
    }

    try {
        const insertPromises = images.map(url => 
            pool.query(
                "INSERT INTO rental_evidence (rental_id, uploaded_by, stage, image_url) VALUES ($1, $2, $3, $4)",
                [req.params.id, req.user.id, stage, url]
            )
        );
        await Promise.all(insertPromises);
        res.json({ message: "Evidence uploaded successfully" });
    } catch (err) {
        console.error("Evidence Upload Error:", err.message);
        res.status(500).send("Server Error");
    }
});

// POST /api/rentals/:id/dispute -> Raise a dispute
router.post('/:id/dispute', auth, async (req, res) => {
    const { reason } = req.body;
    if (!reason) return res.status(400).json({ error: "Dispute reason is required" });

    try {
        // Verify user is involved in rental
        const rentalCheck = await pool.query(
            `SELECT r.id, i.owner_id, r.renter_id, r.status 
             FROM rentals r JOIN items i ON r.item_id = i.id 
             WHERE r.id = $1`, [req.params.id]
        );
        
        if (rentalCheck.rows.length === 0) return res.status(404).json({ error: "Rental not found" });
        const { owner_id, renter_id, status } = rentalCheck.rows[0];
        
        if (req.user.id !== owner_id && req.user.id !== renter_id) {
            return res.status(403).json({ error: "Unauthorized" });
        }
        if (status === 'completed') {
            return res.status(400).json({ error: "Cannot dispute a completely resolved rental" });
        }

        await pool.query(
            "INSERT INTO disputes (rental_id, raised_by, reason) VALUES ($1, $2, $3)",
            [req.params.id, req.user.id, reason]
        );

        // Notify all admins about the new dispute
        const adminNotificationMsg = `🚨 DISPUTE RAISED on Rental #${req.params.id}. Evidence required.`;
        await pool.query(`
            INSERT INTO notifications (user_id, type, message, related_id)
            SELECT id, 'DISPUTE_ESCALATION', $1, $2 FROM users WHERE is_admin = true
        `, [adminNotificationMsg, req.params.id]);

        res.json({ message: "Dispute raised successfully. An admin will review the evidence." });
    } catch (err) {
        console.error("Dispute Error:", err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;