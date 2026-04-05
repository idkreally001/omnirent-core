const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const verifyToken = require('../middleware/auth.middleware');

// Configure Cloudinary from environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * GET /api/upload-signature
 * Returns a short-lived, server-signed upload signature.
 * Requires a valid JWT so anonymous users cannot request signatures.
 */
router.get('/upload-signature', verifyToken, (req, res) => {
    try {
        const timestamp = Math.round(Date.now() / 1000);

        // Sign the timestamp — Cloudinary rejects uploads older than ~1 minute
        const signature = cloudinary.utils.api_sign_request(
            { timestamp },
            process.env.CLOUDINARY_API_SECRET
        );

        res.json({
            signature,
            timestamp,
            apiKey:    process.env.CLOUDINARY_API_KEY,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        });
    } catch (err) {
        console.error('Signature generation failed:', err);
        res.status(500).json({ error: 'Could not generate upload signature' });
    }
});

module.exports = router;
