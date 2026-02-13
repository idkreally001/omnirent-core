/**
 * OmniRent v1.0 - Peer-to-Peer Marketplace
 * Developed by Islam Pashazade
 * * This project is open-source under the MIT License.
 * Attribution is required for all re-distributions.
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load variables from .env

const authRoutes = require('./src/api/routes/auth.routes');
const userRoutes = require('./src/api/routes/user.routes');
const itemRoutes = require('./src/api/routes/item.routes');
const rentalRoutes = require('./src/api/routes/rental.routes');
const initDB = require('./src/db/init');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Middlewares
app.use(cors());
app.use(express.json());

// 2. Logging
app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    next();
});

// 3. Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/rentals', rentalRoutes);

// 4. Atomic Startup Logic
const startApp = async () => {
    try {
        await initDB(); // Run schema automation
        app.listen(PORT, () => {
            console.log(`✅ System Healthy: Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("❌ Critical Startup Error:", err);
        process.exit(1);
    }
};

startApp();