import { Request, Response } from "express";
import UserModel from "../models/user.model";

export const getAllUsers = async (_req:Request,res:Response)=>{
    try {
        const users = await UserModel.find({})
        res.status(200).json({status:'success',message:'fetching users with success',data:users})
        return
    } catch (error) {
        console.log(error);
        res.status(400).json({status:'failed',message:'failed to find users'})
        return
    }
}

export const getUser = (req:Request,res:Response)=>{
    const user = {
        id:req.user?._id,
        username:req.user?.username,
        email:req.user?.email,
        room:req.user.room
    }
    
    res.status(200).json({status:'success',message:'User is authorized',data:user})
}

export const updateUser = async (req:Request,res:Response)=>{
    let room = req.body.room == '' ? 'global' : req.body.room
    
    
   try {
    const updateUser = await UserModel.updateOne({_id:req.user._id},{room:room})
    console.log(updateUser);
    
    res.status(200).json({status:'success',message:'updated successfully'})
    return
   } catch (error) {
    console.log(error);
    res.status(400).json({status:'failed',message:'error'})
    return
   }
}
