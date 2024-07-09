const Candidate = require('../models/Candidate');
const User=require('../models/User');

const Addcandidate = async (req, res) => {
    const { username } = req.body;
    
    try {
        // Find the user by username
        const user = await User.findOne({ username });
    
        // Check if the user exists and if they are a normal user
        if (!user) {
            return res.status(404).json({status:'failed',message:'User not found'});
        }
        if (user.role === 'admin') {
            return res.status(400).json({status:'failed',message:'Only normal users can be added as candidates; you are trying to add an admin user as a candidate'});
        }

        // Check if a candidate with the same username already exists
        const existingCandidate = await Candidate.findOne({ username });
        if (existingCandidate) {
            return res.status(409).json({status:'failed',message:'Candidate with this username already exists'});
        }
            
   
        // Create a new candidate
        const candidate = new Candidate({ username });
        await candidate.save();

        res.status(201).json({status:'success',message:'Candidate added'});
    }catch (error) {
        console.error('Error adding candidate:', error);
        res.status(400).json({status:'failed',message:'Error adding candidate: ' + error.message});
    }
};



 const AllCandidate=async (req, res) => {
          try {
              const candidates = await Candidate.find();
              res.status(200).json({status:'success',message:candidates});
          } catch (error) {
              res.status(500).json({status:'failed',message:error.message});
          }
      }

module.exports={AllCandidate,Addcandidate}