const jwt = require('jsonwebtoken');
require("dotenv").config();

const auth = (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
        return res.status(401).json({status:'failed',message:'Access denied. No token provided.'});
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({status:'failed',message:'Invalid token'});
    }
};

module.exports = auth;

