const jwt = require('jsonwebtoken');

 const auth = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) return res.status(401).send('Access denied');

    try {
        const decoded = jwt.verify(token, 'secret');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).send('Invalid token');
    }
};


module.exports=auth

