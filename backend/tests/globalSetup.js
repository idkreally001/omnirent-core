/**
 * Global Setup — runs ONCE before all test suites.
 * Ensures schema exists in the test database.
 */
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

module.exports = async () => {
    const testUrl = process.env.DATABASE_URL_TEST;
    const realUrl = process.env.DATABASE_URL;

    // SAFETY: Never run tests against production
    if (!testUrl) {
        console.error('\n❌ DATABASE_URL_TEST is not set in .env. Aborting tests to protect production data.');
        console.error('   Add DATABASE_URL_TEST=postgresql://... to your backend/.env file.\n');
        process.exit(1);
    }
    if (testUrl === realUrl) {
        console.error('\n❌ DATABASE_URL_TEST is identical to DATABASE_URL. Refusing to run tests against production.\n');
        process.exit(1);
    }

    const pool = new Pool({ connectionString: testUrl });

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
