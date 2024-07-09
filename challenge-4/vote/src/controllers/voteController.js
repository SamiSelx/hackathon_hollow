const Vote = require('../models/Vote');
const Candidate = require('../models/Candidate');

const voteCandidate = async (req, res) => {
    const { candidateId } = req.body;
    const userId = req.user.userId;
    try {
        // Check if user has already voted
        const existingVote = await Vote.findOne({ userId });
        if (existingVote) return res.status(400).send('User has already voted');

        // Check if the user is a candidate and trying to vote for themselves
        const sameCandidate = await Candidate.findOne({ _id: candidateId, userId });
        if (sameCandidate) return res.status(400).send("You cannot vote for yourself");

        const vote = new Vote({ userId, candidateId });
        await vote.save();

        // Increment candidate votes
        await Candidate.findByIdAndUpdate(candidateId, { $inc: { votes: 1 } });
        res.status(201).send('Vote registered');
    } catch (error) {
        res.status(400).send(error.message);
    }
};

const Allvote = async (req, res) => {
    try {
        const votes = await Vote.find().populate('userId').populate('candidateId');
        res.status(200).json(votes);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = { voteCandidate, Allvote };
