/**
 * Runs BEFORE each test suite loads app code.
 * Swaps DATABASE_URL → DATABASE_URL_TEST so the pg pool
 * connects to the test database, never production.
 */
require('dotenv').config();

if (process.env.DATABASE_URL_TEST) {
    process.env.DATABASE_URL = process.env.DATABASE_URL_TEST;
}
