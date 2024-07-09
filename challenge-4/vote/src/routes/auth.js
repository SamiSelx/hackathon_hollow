const express = require('express');
const {register,logg}=require('../controllers/authcontroller')
const router = express.Router();


// Register
router.post('/register',register);

// Login
router.post('/login', logg);

module.exports = router;
