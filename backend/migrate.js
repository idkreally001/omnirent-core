const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/omnirent' 
});

async function migrate() {
  try {
    await pool.query(`
      ALTER TABLE rentals ADD COLUMN IF NOT EXISTS start_date TIMESTAMP;
      UPDATE rentals SET start_date = rental_date WHERE start_date IS NULL;
      
      CREATE TABLE IF NOT EXISTS item_images (
          id SERIAL PRIMARY KEY,
          item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
          image_url TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      -- We don't delete image_url from items so we don't break existing reads
      -- but we will populate item_images
      INSERT INTO item_images (item_id, image_url)
      SELECT id, image_url FROM items WHERE image_url IS NOT NULL AND image_url != ''
      ON CONFLICT DO NOTHING;
    `);
    console.log('Migration successful');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    pool.end();
  }
}
migrate();
