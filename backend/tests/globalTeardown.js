/**
 * Global Teardown — runs ONCE after all test suites complete.
 * Truncates all tables to leave the DB clean.
 */
const { Pool } = require('pg');
require('dotenv').config();

module.exports = async () => {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    
    try {
        await pool.query(`
            TRUNCATE TABLE rental_evidence, disputes, reviews, notifications, 
                           messages, rentals, items, users 
            RESTART IDENTITY CASCADE
        `);
        console.log('\n🧹 Test DB: All tables truncated (clean state restored)');
    } catch (err) {
        console.error('⚠️  Teardown truncate failed:', err.message);
    } finally {
        await pool.end();
    }
};
