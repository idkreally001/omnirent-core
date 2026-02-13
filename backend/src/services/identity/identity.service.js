const mockAdapter = require('./identity.mock');
const realAdapter = require('./identity.real');
require('dotenv').config(); // Essential to read USE_MOCK

const USE_MOCK = process.env.USE_MOCK === 'true';

const verifyIdentity = async (fullName, tcNo) => {
    if (USE_MOCK) {
        return await mockAdapter.verify(fullName, tcNo);
    }
    return await realAdapter.verify(fullName, tcNo);
};

module.exports = { verifyIdentity };