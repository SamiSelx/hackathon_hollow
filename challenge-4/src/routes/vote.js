const express = require('express');
const auth = require('../middlewares/auth');
const admin=require('../middlewares/admin')
const Vote = require('../models/Vote');
const Candidate = require('../models/Candidate');
const { voteCandidate, Allvote } = require('../controllers/voteController');
const router = express.Router();

// Vote for a candidate
router.post('/', auth, voteCandidate);

// Get all votes (Admin only)
router.get('/', [auth, admin], Allvote);

module.exports = router;
