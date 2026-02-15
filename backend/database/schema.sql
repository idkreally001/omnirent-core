-- Users: Core identity with secure hashing
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    tc_no VARCHAR(11),
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Items: Inventory with availability state machine
CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price_per_day DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50),
    image_url TEXT,
    status VARCHAR(20) DEFAULT 'available', -- 'available', 'rented'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 1. Users: Added 'balance'
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    tc_no VARCHAR(11),
    password_hash TEXT NOT NULL,
    balance DECIMAL(10, 2) DEFAULT 0.00, -- New Wallet Field
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Items: Added 'is_deleted' for Soft Deletes
CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price_per_day DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50),
    image_url TEXT,
    status VARCHAR(20) DEFAULT 'available',
    is_deleted BOOLEAN DEFAULT FALSE, -- New Soft Delete Flag
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Rentals: Unchanged (But now safe from cascades)
CREATE TABLE IF NOT EXISTS rentals (
    id SERIAL PRIMARY KEY,
    item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
    renter_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    return_date TIMESTAMP NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Social Trust: One review per rental per participant
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    rental_id INTEGER REFERENCES rentals(id) ON DELETE CASCADE,
    reviewer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    reviewee_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(rental_id, reviewer_id) -- Prevents duplicate reviews
);

-- Risk Management: Structured Disputes
CREATE TABLE IF NOT EXISTS disputes (
    id SERIAL PRIMARY KEY,
    rental_id INTEGER REFERENCES rentals(id) ON DELETE CASCADE,
    raised_by INTEGER REFERENCES users(id),
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'open', -- 'open', 'under_review', 'resolved'
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'RENTAL_REQUEST', 'RETURN_CONFIRMED', 'NEW_MESSAGE'
    message TEXT NOT NULL,
    related_id INTEGER, -- Stores rental_id or item_id for quick navigation
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);