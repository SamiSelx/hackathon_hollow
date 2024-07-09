import { Request,Response } from "express"
import UserModel from "../models/user.model"
import RoomModel from "../models/room.model"
import ResponseI from "../types/response"


export const joinRoom = async (req:Request,res:Response)=>{
    const {roomName} = req.body
    const senderId = req.user._id

    try {
        const user = await UserModel.findOne({_id:senderId})
        const exist = user?.room.find(r=>r == roomName)
        if(exist){
            const response:ResponseI = {status:'failed',message:'user already in the room'}
            res.status(400).json(response)
            return
        }
        const room = await RoomModel.findOne({roomName})
        if(!room){
            const response:ResponseI = {status:'failed',message:"Room doesn't exist"}
            res.status(400).json(response)
            return
        }

        await RoomModel.updateOne({roomName},{$push:{users:user?._id}})
        await UserModel.updateOne({_id:senderId},{$push:{room:roomName}})
        const response:ResponseI = {status:'success',message:'joined successfully'}
        res.status(200).json(response)
        
        
    } catch (error) {
        console.log(error);
        const response:ResponseI = {status:'failed',message:'failed to join'}
        res.status(400).json(response)
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
            const response:ResponseI = {status:'failed',message:'room is already exist'}
            res.status(400).json(response)
            return
        }
        
        const roomCreated = await RoomModel.create({roomName,users:[senderId]})
        await UserModel.updateOne({_id:senderId},{$push:{room:roomName}})
        const response:ResponseI = {status:'success',message:'Room Created',data:roomCreated}
        res.status(200).json(response)
        return
        
    } catch (error) {
        console.log(error);
        const response:ResponseI = {status:'failed',message:'failed to Create'}
        res.status(400).json(response)
        return
    }
}


export const getRoom = async (req:Request, res:Response) => {
    console.log(req.params);
  
    let { roomName } = req.params;
    console.log(roomName);
  
    try {
      const room = await RoomModel.findOne({ roomName });
      const response:ResponseI = { status: "success", message: "room found", data: room }
      res
        .status(200)
        .json(response);
      return;
    } catch (error) {
      console.log(error);
      const response:ResponseI = { status: "failed", message: "room Not found" }
      res.status(400).json(response);
      return;
    }
  }