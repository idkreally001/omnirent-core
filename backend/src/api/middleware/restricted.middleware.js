/**
 * Middleware: requireNotRestricted
 * 
 * Must be used AFTER the main `auth` middleware (which sets req.user).
 * Blocks users with `is_restricted = true` from performing sensitive
 * platform actions while still allowing them to stay logged in.
 */
module.exports = function requireNotRestricted(req, res, next) {
    if (req.user && req.user.is_restricted) {
        return res.status(403).json({
            error: "Your account has been restricted. You cannot perform this action. Please contact support for details.",
            code: "ACCOUNT_RESTRICTED"
        });
    }
    next();
};
