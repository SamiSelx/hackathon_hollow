const express = require('express');
const {register,logg}=require('../controllers/voteController')
const User = require('../models/User');

const router = express.Router();


// Register
router.post('/register',register);

// Login
router.post('/login', logg);

module.exports = router;
