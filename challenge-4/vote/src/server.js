const express = require("express");
 require("dotenv").config()
const connectDb = require("./config/connectDb"); // Importing connectDb
const bodyParser = require('body-parser');
const path=require('path');
// Calling our connectDB function
connectDb();

const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());

// Middleware
app.use(bodyParser.json());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

const logger = require('./utils/loger');

// Log all requests
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

// Log errors
app.use((err, req, res, next) => {
    logger.error(err.message);
    res.status(500).json({status:'failed',message:'Something went wrong'});
});

const authRoutes = require('./routes/auth');
const candidateRoutes = require('./routes/candidate');
const voteRoutes = require('./routes/vote');

app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/votes', voteRoutes);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});