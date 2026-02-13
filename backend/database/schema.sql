-- schema.sql
-- Run this inside your 'omnirent' database

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    tc_no VARCHAR(11),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Items Table (The products for rent)
CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price_per_day DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50),
    status VARCHAR(20) DEFAULT 'available', -- 'available', 'rented', 'maintenance'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Rentals Table (The transactions/contracts)
CREATE TABLE IF NOT EXISTS rentals (
    id SERIAL PRIMARY KEY,
    item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
    renter_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_price DECIMAL(10, 2),
    status VARCHAR(20) DEFAULT 'requested' -- 'requested', 'active', 'completed', 'disputed'
);