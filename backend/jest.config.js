module.exports = {
    testEnvironment: 'node',
    testTimeout: 15000,
    verbose: true,
    // Setup file runs before all test suites
    globalSetup: './tests/globalSetup.js',
    globalTeardown: './tests/globalTeardown.js',
    setupFilesAfterFramework: ['./tests/setup.js'],
};
