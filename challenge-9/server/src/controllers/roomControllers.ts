import { Request,Response } from "express"
import UserModel from "../models/user.model"
import RoomModel from "../models/room.model"


export const joinRoom = async (req:Request,res:Response)=>{
    const {roomName} = req.body
    const senderId = req.user._id

    try {
        const user = await UserModel.findOne({_id:senderId})
        const exist = user?.room.find(r=>r == roomName)
        if(exist){
            res.status(400).json({status:'failed',message:'user already in the room'})
            return
        }
        const room = await RoomModel.findOne({roomName})
        if(!room){
            res.status(400).json({status:'failed',message:"Room doesn't exist"})
            return
        }

        await RoomModel.updateOne({roomName},{$push:{users:user?._id}})
        await UserModel.updateOne({_id:senderId},{$push:{room:roomName}})

        res.status(200).json({status:'success',message:'joined successfully'})
        
        
    } catch (error) {
        console.log(error);
        res.status(400).json({status:'failed',message:'failed to join'})
        return
    }
}



export const createRoom = async (req:Request,res:Response)=>{
    const {roomName} = req.body
    const senderId = req.user._id

    try {
        // verify if room exist
        const room = await RoomModel.findOne({roomName})
        if(room){
            res.status(400).json({status:'failed',message:'room is already exist'})
            return
        }
        
        const roomCreated = await RoomModel.create({roomName,users:[senderId]})
        await UserModel.updateOne({_id:senderId},{$push:{room:roomName}})
        res.status(200).json({status:'success',message:'Room Created',data:roomCreated})
        return
        
    } catch (error) {
        console.log(error);
        res.status(400).json({status:'failed',message:'failed to Create'})
        return
    }
}