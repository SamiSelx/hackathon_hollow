const express = require('express');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const Candidate = require('../models/Candidate');
const { Addcandidate, AllCandidate } = require('../controllers/voteController');
const router = express.Router();

// Add candidate
router.post('/', [auth, admin],Addcandidate);

// Get all candidates
router.get('/', auth, AllCandidate);

module.exports = router;
