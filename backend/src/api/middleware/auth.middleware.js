const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
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

        // 4. Add the user ID to the request object
        req.user = decoded;
        next(); // Move to the actual route logic
    } catch (err) {
        res.status(401).json({ error: "Token is not valid" });
    }
};