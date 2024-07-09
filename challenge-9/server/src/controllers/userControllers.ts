import { Request, Response } from "express";
import UserModel from "../models/user.model";
import ResponseI from "../types/response";

export const getAllUsers = async (_req:Request,res:Response)=>{
    try {
        const users = await UserModel.find({})
        const response:ResponseI = {status:'success',message:'fetching users with success',data:users}
        res.status(200).json(response)
        return
    } catch (error) {
        console.log(error);
        const response:ResponseI = {status:'failed',message:'failed to find users'}
        res.status(400).json(response)
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
    const response:ResponseI = {status:'success',message:'User is authorized',data:user}
    
    res.status(200).json(response)
}

export const updateUser = async (req:Request,res:Response)=>{
    let room = req.body.room == '' ? 'global' : req.body.room
    
    
   try {
    const updateUser = await UserModel.updateOne({_id:req.user._id},{room:room})
    const response:ResponseI = {status:'success',message:'updated successfully'}
    res.status(200).json(response)
    return
   } catch (error) {
    console.log(error);
    const response:ResponseI = {status:'failed',message:'error'}
    res.status(400).json(response)
    return
   }
}
