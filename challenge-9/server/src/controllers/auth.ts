import { Request,Response } from "express"
import UserModel from "../models/user.model"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { userValidator } from "../utils/userValidator"
import ResponseI from "../types/response"

export const login = async (req:Request,res:Response)=>{
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
        const userLogin = {
            id:user._id.toString(),
            username:user.username,
            email:user.email,
            room:user.room,
            token
        }
        const response:ResponseI = {status:'success',message:'login successfully',data:userLogin}
        res.status(200).json(response)
   
    } catch (error) {
        console.log(error);
        const response:ResponseI = {status:'failed',message:'error'}
        res.status(400).json(response)
        return
    }

}


export const register = async (req:Request,res:Response)=>{
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
        const userRegistred = {
            id:userCreated._id.toString(),
            username:userCreated.username,
            email:userCreated.email,
            room:userCreated.room,
            token
        }
        res.status(201).json({status:'success',message:'User Created Successfully',data:userRegistred})

    } catch (error) {
        console.log(error);
        res.status(400).json({status:'failed',message:'Creation failed'})
    }

}
