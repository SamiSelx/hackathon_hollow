const user=require('../models/User');

 const admin = (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(403).json({status:'failed',message:'Access denied'});
    next();
};

module.exports=admin