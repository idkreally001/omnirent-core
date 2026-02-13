const express = require('express');
const cors = require('cors');
const pool = require('./src/db'); // Your DB connection
const identityService = require('./src/services/identity/identity.service'); 

const app = express();
app.use(cors());
app.use(express.json());

// Registration Endpoint
app.post('/api/register', async (req, res) => {
    const { fullName, email, tcNo } = req.body;

    try {
        // 1. Call the "James" Service (Identity Service)
        const verification = await identityService.verifyIdentity(fullName, tcNo);
        
        if (!verification.success) {
            return res.status(400).json({ error: "Identity could not be verified." });
        }

        // 2. Save to Postgres
        const newUser = await pool.query(
            "INSERT INTO users (full_name, email, tc_no) VALUES ($1, $2, $3) RETURNING *",
            [fullName, email, tcNo]
        );

        res.json({ message: "User registered successfully!", user: newUser.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));