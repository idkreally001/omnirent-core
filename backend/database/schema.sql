-- 1. Users: Identity & Financials
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    tc_no VARCHAR(11),
    password_hash TEXT NOT NULL,
    balance DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Items: Inventory & Soft Deletion
CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price_per_day DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50),
    image_url TEXT,
    status VARCHAR(20) DEFAULT 'available',
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Rentals: Transaction Records
CREATE TABLE IF NOT EXISTS rentals (
    id SERIAL PRIMARY KEY,
    item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
    renter_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    rental_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Added to match your psql output
    return_date TIMESTAMP NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'returned_by_renter', 'completed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Reviews: Social Trust (One per rental per participant)
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    rental_id INTEGER REFERENCES rentals(id) ON DELETE CASCADE,
    reviewer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    target_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(rental_id, reviewer_id)
);

-- 5. Notifications: Event Bus
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    related_id INTEGER,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Disputes: Conflict Resolution
CREATE TABLE IF NOT EXISTS disputes (
    id SERIAL PRIMARY KEY,
    rental_id INTEGER REFERENCES rentals(id) ON DELETE CASCADE,
    raised_by INTEGER REFERENCES users(id),
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'open',
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);  

-- 7. Messages: Peer-to-Peer Communication
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    item_id INTEGER REFERENCES items(id) ON DELETE SET NULL, -- Better UX: Chat stays if item is deleted
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP
);

--- PERFORMANCE INDEXES ---
-- For fast conversation loading
CREATE INDEX IF NOT EXISTS idx_messages_participants ON messages (sender_id, receiver_id);
-- For fast notification badge counts
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications (user_id) WHERE is_read = FALSE;
-- For fast profile review loading
CREATE INDEX IF NOT EXISTS idx_reviews_target ON reviews (target_user_id);