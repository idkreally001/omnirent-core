const pool = require('../../db');
const fs = require('fs');
const path = require('path');

const initializeDatabase = async () => {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');

  try {
    await pool.query(schema);
    console.log("✅ Database Schema Synced Successfully");
  } catch (err) {
    console.error("❌ Database Initialization Failed:", err);
    process.exit(1);
  }
};

module.exports = initializeDatabase;