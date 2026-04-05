/**
 * Global Setup — runs ONCE before all test suites.
 * Ensures schema exists in the test database.
 */
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

module.exports = async () => {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    
    try {
        // Run schema to ensure all tables exist
        const schemaPath = path.join(__dirname, '../database/schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        await pool.query(schema);
        console.log('\n🧪 Test DB: Schema verified');
    } catch (err) {
        console.error('❌ Test DB setup failed:', err.message);
        throw err;
    } finally {
        await pool.end();
    }
};
