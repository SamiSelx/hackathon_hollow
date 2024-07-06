import { Request,Response } from "express"
import UserModel from "../models/user.model"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const login = async (req:Request,res:Response)=>{
    const {email,password} = req.body

    try {
        const user = await UserModel.findOne({email})
        if(!user){
            res.status(400).json({status:'failed',message:'email invalid'})
            return
        }
        const isMatch  = await bcrypt.compare(password,user.password)
        if(!isMatch){
            res.status(400).json({status:'failed',message:'password invalid'})
            return
        }
        const token = jwt.sign({_id:user._id},process.env.SECRET_KEY!)
        res.status(200).json({status:'success',message:'login successfully',token})
   
    } catch (error) {
        console.log(error);
        res.status(400).json({status:'failed',message:'error'})
        return
    }

}

export default login