const pool = require('../db'); // Up one level to src/db.js
const fs = require('fs');
const path = require('path');

const initializeDatabase = async () => {
  // Path: src/db -> src -> backend -> database/schema.sql
  const schemaPath = path.join(__dirname, '../../database/schema.sql'); 
  
  try {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(schema);
    console.log("🛠️  Database Schema Verification Complete");
  } catch (err) {
    console.error("❌ Database Initialization Failed:", err);
    throw err; 
  }
};

module.exports = initializeDatabase;