const pool = require('../../db');

module.exports = async function (req, res, next) {
    if (!req.user || !req.user.id) {
         return res.status(401).json({ error: "Not authenticated" });
    }
    try {
         const userQuery = await pool.query("SELECT is_admin FROM users WHERE id = $1", [req.user.id]);
         if (userQuery.rows.length === 0 || !userQuery.rows[0].is_admin) {
             return res.status(403).json({ error: "Access denied. Admin privileges required." });
         }
         next();
    } catch(err) {
         res.status(500).json({ error: "Server error verifying admin status." });
    }
};
