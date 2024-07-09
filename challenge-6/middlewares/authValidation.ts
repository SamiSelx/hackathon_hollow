// Assuming you have a base Express Request type (adjust based on your Express version)
// Extend Request with optional userId

import { configDotenv } from 'dotenv'; 
configDotenv()// Load environment variables for secret key
import { Request, Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken';

