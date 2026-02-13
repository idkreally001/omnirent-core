const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

const comparePassword = async (password, hashed) => {
    return await bcrypt.compare(password, hashed);
};

const generateToken = (userId) => {
    // This creates a token that expires in 24 hours
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

module.exports = { hashPassword, comparePassword, generateToken };