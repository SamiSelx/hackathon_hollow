const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User=require('../models/User')
require("dotenv").config();

const register=async (req, res) => {
          const { username, password, role } = req.body;
      
          try {
              const hashedPassword = await bcrypt.hash(password, 10);
              const user = new User({ username, password: hashedPassword, role });
              await user.save();

              res.status(201).json({status:"success",message:"user registred",user})
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

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
        console.log('the token :');
        console.log(token)
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports={logg,register}