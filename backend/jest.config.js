module.exports = {
    testEnvironment: 'node',
    testTimeout: 15000,
    verbose: true,
    globalSetup: './tests/globalSetup.js',
    globalTeardown: './tests/globalTeardown.js',
    // Swap DATABASE_URL to the test DB BEFORE app code loads
    setupFiles: ['./tests/envSetup.js'],
};
