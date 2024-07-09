"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAcessToken = void 0;
exports.isAuth = isAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
const generateAcessToken = (id) => {
    const secret = process.env.ACESS_TOKEN_SECRET;
    if (!secret) {
        throw new Error(' missing env variable :secret required');
    }
    try {
        const token = jsonwebtoken_1.default.sign({ id }, secret, { expiresIn: "1h" });
        return token;
    }
    catch (error) {
        console.log('error generating token', error);
        return undefined;
    }
};
exports.generateAcessToken = generateAcessToken;
function isAuth(req, res, next) {
    const authorizationHeader = req.headers.authorization;
    // Check if Authorization header exists
    if (!authorizationHeader) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    // Check for the expected format (Bearer <token>)
    if (!authorizationHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token format' });
    }
    // Extract the token from the header
    const token = authorizationHeader.substring(7); // Remove "Bearer " from the start of the string
    try {
        // Verify the JWT token
        const secret = process.env.ACESS_TOKEN_SECRET;
        console.log(secret);
        if (secret) {
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            // Attach user ID to the request object (cast to number)
            req.userId = decoded.id;
            console.log('access granted');
            // Continue to the next middleware or route handler
            next();
        }
        else {
            throw new Error('no secret key');
        }
    }
    catch (error) {
        // Handle JWT verification errors
        console.error('Error verifying JWT token:', error);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
}
