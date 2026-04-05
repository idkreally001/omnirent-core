/**
 * Test Helpers — shared utilities for all test files.
 * Provides convenience methods for creating users, items, adding funds, etc.
 */
const request = require('supertest');
const { app } = require('../server');
const pool = require('../src/db');
const authService = require('../src/services/auth.service');

/**
 * Truncates all tables between tests for isolation.
 */
const truncateAll = async () => {
    await pool.query(`
        TRUNCATE TABLE rental_evidence, disputes, reviews, notifications, 
                       messages, rentals, items, users 
        RESTART IDENTITY CASCADE
    `);
};

/**
 * Registers a test user and returns their token + user data.
 * Auto-verifies the user to keep existing tests functional.
 */
const createTestUser = async (fullName = 'Test User', email = 'test@test.com', password = 'Password123') => {
    const res = await request(app)
        .post('/api/auth/register')
        .send({ fullName, email, password });
    
    // 📧 AUTO-VERIFY in DB for tests
    await pool.query("UPDATE users SET is_email_verified = TRUE WHERE id = $1", [res.body.user.id]);
    
    // Manually generate token since registration no longer returns it
    const token = authService.generateToken(res.body.user.id);
    return { token, user: res.body.user };
};

/**
 * Creates a test item listed by the given user.
 */
const createTestItem = async (token, overrides = {}) => {
    const itemData = {
        title: overrides.title || 'Test Drill',
        description: overrides.description || 'A powerful test drill',
        price: overrides.price || 50,
        category: overrides.category || 'Tools',
        image_url: overrides.image_url || 'https://example.com/drill.jpg',
    };
    const res = await request(app)
        .post('/api/items')
        .set('Authorization', `Bearer ${token}`)
        .send(itemData);
    return res.body;
};

/**
 * Adds funds to a user's wallet.
 */
const addFunds = async (token, amount) => {
    await request(app)
        .post('/api/user/add-funds')
        .set('Authorization', `Bearer ${token}`)
        .send({ amount });
};

/**
 * Creates a full rental between an owner and renter.
 * Returns the rental response.
 */
const createRental = async (renterToken, itemId, totalPrice = 100) => {
    const returnDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const res = await request(app)
        .post('/api/rentals')
        .set('Authorization', `Bearer ${renterToken}`)
        .send({ itemId, returnDate, totalPrice });
    return res;
};

/**
 * Makes a user an admin via direct DB update.
 */
const makeAdmin = async (userId) => {
    await pool.query("UPDATE users SET is_admin = true WHERE id = $1", [userId]);
};

module.exports = {
    app,
    request,
    pool,
    truncateAll,
    createTestUser,
    createTestItem,
    addFunds,
    createRental,
    makeAdmin,
};
