import { Request,Response } from "express"
import UserModel from "../models/user.model"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { userValidator } from "../utils/userValidator"


const register = async (req:Request,res:Response)=>{
    const {username,email,password} = req.body
    if(!username || !email || !password){
        res.status(400).json({status:'failed',message:'u must fill all the field'})
        return
    }

    const exist = await UserModel.findOne({email})
    if(exist){
        res.status(400).json({status:'failed',message:'email already used'})
        return
    }

    const {error} = userValidator.validate({username,email,password})
    console.log(error);
    
    if(error){
        res.status(400).json({status:'failed',message:error.details[0].message})
        return
    }
    
    try {
        const saltRound = 10
        const salt = await bcrypt.genSalt(saltRound)
        const passwordHash = await bcrypt.hash(password,salt)
        const userCreated = await UserModel.create({username,email,password:passwordHash})
        const token = jwt.sign({_id:userCreated._id},process.env.SECRET_KEY!)
        res.status(201).json({status:'success',message:'User Created Successfully',token})

    } catch (error) {
        console.log(error);
        res.status(400).json({status:'failed',message:'Creation failed'})
    }

}

export default register