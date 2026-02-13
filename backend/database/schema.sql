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

-- Rentals: Transactional contracts
CREATE TABLE IF NOT EXISTS rentals (
    id SERIAL PRIMARY KEY,
    item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
    renter_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    return_date TIMESTAMP NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);