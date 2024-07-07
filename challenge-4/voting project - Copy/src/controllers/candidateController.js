const Candidate = require('../models/Candidate');
const User=require('../models/User');

const Addcandidate=async (req, res) => {
          const { name } = req.body;
      
          try {
          
          // Find the user by name 
        const user = await User.findOne({ name });

        // Check if the user exists and if they are a normal user
        if (!user) {
            return res.status(404).send('User not found');
        }
        if (user.role !== 'normal') {
            return res.status(400).send('Only normal users can be added as candidates');
        }


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

module.exports={AllCandidate,Addcandidate}