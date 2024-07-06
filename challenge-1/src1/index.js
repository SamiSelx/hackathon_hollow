const express = require('express');
const bodyParser = require('body-parser'); // Import body-parser
const dotenv = require('dotenv'); // Import dotenv
const connectDb = require('./config/dbConnection'); // Importing connectDb
const characterRoutes = require('./routes/characters');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables from .env file
dotenv.config();

// Call our connectDB function
connectDb();

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/characters', characterRoutes);

// 404 Middleware
app.use((req, res, next) => {
  res.status(404);
  const error = new Error('Not Found');
  next(error);
});

// Error handling middleware
app.use(errorHandler);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
