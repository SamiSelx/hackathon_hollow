const express = require('express');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const Candidate = require('../models/Candidate');
const { Addcandidate, AllCandidate } = require('../controllers/candidateController');
const router = express.Router();

// Add candidate:Only the admin can add candidates
router.post('/', [auth, admin],Addcandidate);

// Get all candidates
router.get('/', auth, AllCandidate);

module.exports = router;
