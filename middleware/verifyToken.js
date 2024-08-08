const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken')
const dotEnv = require('dotenv')
dotEnv.config()
const verifyToken = (req, res, next) => {
    const token = req.header('token');
    if (!token) return res.status(401).json({ error: 'Access denied, no token provided' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.vendorId = verified.id;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

module.exports = verifyToken;
