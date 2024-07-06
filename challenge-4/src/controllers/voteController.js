const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register=async (req, res) => {
          const { username, password, role } = req.body;
      
          try {
              const hashedPassword = await bcrypt.hash(password, 10);
              const user = new User({ username, password: hashedPassword, role });
              await user.save();
              res.status(201).send('User registered');
          } catch (error) {
              res.status(400).send(error.message);
          }
      }

const logg=async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).send('User not found');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send('Invalid credentials');

        const token = jwt.sign({ userId: user._id, role: user.role }, 'secret', { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const Addcandidate=async (req, res) => {
    const { name } = req.body;

    try {
        const candidate = new Candidate({ name });
        await candidate.save();
        res.status(201).send('Candidate added');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const AllCandidate=async (req, res) => {
    try {
        const candidates = await Candidate.find();
        res.status(200).json(candidates);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const voteCandidate=async (req, res) => {
    const { candidateId } = req.body;
    const userId = req.user.userId;

    try {
        // Check if user has already voted
        const existingVote = await Vote.findOne({ userId });
        if (existingVote) return res.status(400).send('User has already voted');

        const vote = new Vote({ userId, candidateId });
        await vote.save();

        // Increment candidate votes
        await Candidate.findByIdAndUpdate(candidateId, { $inc: { votes: 1 } });

        res.status(201).send('Vote registered');
    } catch (error) {
        res.status(400).send(error.message);
    }
}


const Allvote=async (req, res) => {
    try {
        const votes = await Vote.find().populate('userId').populate('candidateId');
        res.status(200).json(votes);
    } catch (error) {
        res.status(500).send(error.message);
    }
}
module.exports={register,logg,Addcandidate,AllCandidate,voteCandidate,Allvote}