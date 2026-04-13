const jwt = require('jsonwebtoken');
const pool = require('../../db');

module.exports = async function (req, res, next) {
    // 1. Get the token from the header
    const token = req.header('Authorization');

    // 2. Check if no token
    if (!token) {
        return res.status(401).json({ error: "No token, authorization denied" });
    }

    try {
        // 3. Verify token (Remove 'Bearer ' if present)
        const tokenString = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
        const decoded = jwt.verify(tokenString, process.env.JWT_SECRET);

        // 4. Check if the user still exists in the DB, or is banned
        const userCheck = await pool.query("SELECT id, is_banned, is_restricted FROM users WHERE id = $1", [decoded.id]);
        if (userCheck.rows.length === 0) {
            return res.status(401).json({ error: "Session expired or user not found" });
        }
        if (userCheck.rows[0].is_banned) {
            return res.status(403).json({ error: "Your account has been banned due to policy violations. Contact support." });
        }

        // 5. Add the user ID + restriction state to the request object
        req.user = { ...decoded, is_restricted: userCheck.rows[0].is_restricted };
        next(); // Move to the actual route logic
    } catch (err) {
        res.status(401).json({ error: "Token is not valid" });
    }
};