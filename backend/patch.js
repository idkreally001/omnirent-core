require('dotenv').config();
const pool = require('./src/db');

async function patch() {
    try {
        console.log("🚀 Starting Production Schema Migration...");

        // 1. Users: Add is_admin
        await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;');
        console.log("✅ Users: is_admin column secured.");

        // 2. Disputes: Add resolution and admin_notes
        await pool.query('ALTER TABLE disputes ADD COLUMN IF NOT EXISTS resolution VARCHAR(50);');
        await pool.query('ALTER TABLE disputes ADD COLUMN IF NOT EXISTS admin_notes TEXT;');
        console.log("✅ Disputes: resolution & admin_notes columns secured.");

        // 3. Messages: Ensure read logic exists (Performance fix)
        await pool.query('ALTER TABLE messages ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE;');
        await pool.query('ALTER TABLE messages ADD COLUMN IF NOT EXISTS read_at TIMESTAMP;');
        console.log("✅ Messages: read_at & is_read logic secured.");

        // 4. Ensure Evidence table exists (If it wasn't there before)
        const schema = `
            CREATE TABLE IF NOT EXISTS rental_evidence (
                id SERIAL PRIMARY KEY,
                rental_id INTEGER REFERENCES rentals(id) ON DELETE CASCADE,
                uploaded_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
                stage VARCHAR(20) NOT NULL,
                image_url TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await pool.query(schema);
        console.log("✅ Rental Evidence: Table verification complete.");

        console.log("\n📦 PRODUCTION READY: Your database schema is now 100% synchronized.");
        process.exit(0);
    } catch(err) {
        console.error("❌ Migration failed:", err);
        process.exit(1);
    }
}

patch();
