import { Request,Response,NextFunction } from "express"
import jwt from "jsonwebtoken"
import UserModel from "../models/user.model"
import { UserI } from "../types/user"

type UserJwt = {
    _id:string
}

declare global{
    namespace Express{
        interface Request{
            user:UserI
        }
    }
}

export default async function  Authorization (req:Request,res:Response,next:NextFunction){
    const token = req.headers.authorization?.split(' ')[1]
    if(!token){
        res.status(401).json({status:'failed',message:'Not Authorized'})
        return
    }

    try {
        const verify = jwt.verify(token,process.env.SECRET_KEY!)
        const {_id} = verify as UserJwt
        const user = await UserModel.findById(_id) as UserI
        req.user = user
        next()
    } catch (error) {
        res.status(400).json({status:'failed',message:'token invalid'})
        return
    }

}


