import jwt,{Jwt}from 'jsonwebtoken' 
import { configDotenv } from 'dotenv'
import { Request,Response,NextFunction } from 'express'
configDotenv()
 const generateAcessToken= (id:Number):string |undefined =>{
     const secret:string|undefined  = process.env.ACESS_TOKEN_SECRET
     if(!secret){
          throw new  Error(' missing env variable :secret required')
     }
     try{
          
               const token= jwt.sign({id},secret,{expiresIn:"1h"})
               return token
     }catch(error:any){
          console.log('error generating token', error)
          return undefined
     }
}

type MyRequest<T> = Request<T> & { userId?: number }; 
interface JwtPayload {
  id: number; // User ID (now a number)
  username?: string; // Username (optional)
  // ... other fields based on your JWT payload structure
}

export function isAuth<T>(req: MyRequest<T>, res: Response, next: NextFunction) {

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
    const secret:string|undefined = process.env.ACESS_TOKEN_SECRET;
    console.log(secret)
    if (secret) {
      const decoded = jwt.verify(token, secret) as JwtPayload;

      // Attach user ID to the request object (cast to number)
      req.userId = decoded.id;
     console.log('access granted')
      // Continue to the next middleware or route handler
      next();
    } else {
       throw new Error('no secret key')
    }
  } catch (error) {
    // Handle JWT verification errors
    console.error('Error verifying JWT token:', error);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
}
export {generateAcessToken}