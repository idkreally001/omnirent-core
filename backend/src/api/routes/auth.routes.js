const express = require('express');
const router = express.Router();
const pool = require('../../db');
const authService = require('../../services/auth.service');

// LOGIN ROUTE
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        
        if (user.rows.length === 0) {
            return res.status(401).json({ error: "Invalid Credentials" });
        }

        const isMatch = await authService.comparePassword(password, user.rows[0].password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid Credentials" });
        }

        const token = authService.generateToken(user.rows[0].id);
        res.json({ token, user: { id: user.rows[0].id, name: user.rows[0].full_name, is_admin: user.rows[0].is_admin } });
        
    } catch (err) {
        res.status(500).send("Server Error");
    }
});


// REGISTER ROUTE
router.post('/register', async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        // 1. Check if user already exists
        const userExist = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userExist.rows.length > 0) {
            return res.status(400).json({ error: "User already exists" });
        }

        // 2. Hash the password
        const passwordHash = await authService.hashPassword(password);

        // 3. Save to database
        const newUser = await pool.query(
            "INSERT INTO users (full_name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, full_name, email",
            [fullName, email, passwordHash]
        );

        // 4. Generate Token
        const token = authService.generateToken(newUser.rows[0].id);

        res.json({ token, user: newUser.rows[0] });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;