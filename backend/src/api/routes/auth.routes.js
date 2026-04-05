const express = require('express');
const router = express.Router();
const pool = require('../../db');
const authService = require('../../services/auth.service');
const emailService = require('../../services/emailService');
const crypto = require('crypto');

const rateLimit = require('express-rate-limit');

// Strict limiter: Only 5 login attempts per 15 minutes per IP
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 10, // Slightly more relaxed since people might mess up verification 
    message: { error: "Too many login attempts. Please try again in 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
});

// LOGIN ROUTE
router.post('/login', loginLimiter, async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        
        if (user.rows.length === 0) {
            return res.status(401).json({ error: "Invalid Credentials" });
        }

        // Check if email is verified
        if (!user.rows[0].is_email_verified) {
             return res.status(403).json({ error: "Your email is not verified. Please check your inbox for the activation link." });
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

        // 3. Generate Verification Token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // 4. Save to database (Status: unverified)
        const newUser = await pool.query(
            "INSERT INTO users (full_name, email, password_hash, verification_token) VALUES ($1, $2, $3, $4) RETURNING id, full_name, email",
            [fullName, email, passwordHash, verificationToken]
        );

        // 5. Send Verification Email (Don't wait for it to finish, send in background)
        emailService.sendVerificationEmail(email, fullName, verificationToken).catch(err => {
            console.error("Verification email failed to send:", err);
        });

        res.json({ 
            message: "Registration successful! Please check your email to verify your account.",
            user: { id: newUser.rows[0].id, name: newUser.rows[0].full_name, email: newUser.rows[0].email }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// EMAIL VERIFICATION ENDPOINT
router.get('/verify-email', async (req, res) => {
    const { token } = req.query;
    
    if (!token) return res.status(400).json({ error: "Token is required" });

    try {
        const user = await pool.query("SELECT * FROM users WHERE verification_token = $1", [token]);
        
        if (user.rows.length === 0) {
            return res.status(400).json({ error: "Invalid or expired verification token." });
        }

        // Activate the user
        await pool.query(
            "UPDATE users SET is_email_verified = TRUE, verification_token = NULL WHERE id = $1",
            [user.rows[0].id]
        );

        // Send a nice success response (you could also redirect to the login page here)
        res.send(`
            <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f0fdf4;">
                <div style="text-align: center; background: white; padding: 2rem; border-radius: 20px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">
                    <h1 style="color: #16a34a;">Account Verified!</h1>
                    <p style="color: #4b5563;">Your email has been confirmed. You can now log in to OmniRent.</p>
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 1rem;">Go to Login</a>
                </div>
            </body>
        `);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;