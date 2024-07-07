import { Request,Response } from "express"
import UserModel from "../models/user.model"
import MessageModel from "../models/message.model"
import ConversationModel from "../models/conversation.model"
import RoomModel from "../models/room.model"

export const sendMessage = async (req:Request,res:Response)=>{
    const {recieverId} = req.params
    const senderId = req.user._id
    const {message} = req.body
    const filePath = req.file ? `/uploads/${req.file?.filename}` : null
    console.log('message from client',message);

    
    
    try {
        // search if reciever exist
        const exist = await UserModel.find({_id:recieverId})
        console.log(exist);
        
        if(!exist){
            res.status(400).json({status:'failed',message:"user doesn't exist"})
        }

        // create message
        const messageCreated = await MessageModel.create({recieverId,senderId,message:{message,filePath}})
        // search conversation between reciever and sender
        let conversation = await ConversationModel.findOne({particapate:{$all:[senderId,recieverId]}})

        //create conversation if conversation between them doesn't exist
        if(!conversation){
            conversation = await ConversationModel.create({particapate:[senderId,recieverId]})
        }

        await ConversationModel.updateOne({_id:conversation._id},{$push:{messages:messageCreated._id}})
        
        
        res.status(200).json({status:'success',message:'message has been sent',data:messageCreated,filePath})
    } catch (error) {
        console.log(error);
        res.status(400).json({status:'failed',message:'failed to send a message'})
    }

}

export const sendMessageRoom = async (req:Request,res:Response)=>{
    const {roomName} = req.params
    const senderId = req.user._id
    const {message} = req.body

    try {
        // search if Room exist
        const room = await RoomModel.findOne({roomName})
        
        console.log('after');
        console.log(room);
        
        if(!room){
            res.status(400).json({status:'failed',message:"Room doesn't exist"})
            return
        }
        // verify if Sender inside Room
        const user = room?.users.find(user => user._id.toString() == senderId)
        if(!user){
            res.status(400).json({status:'failed',message:"User doesn't exist on room"})
            return
        }

        // create message
        const messageCreated = await MessageModel.create({recieverId:roomName,senderId,message})
        // search conversation on the room
        let conversation = await ConversationModel.findOne({_id:room.conversation})
        //create conversation if conversation between them doesn't exist
        if(!conversation){
            conversation = await ConversationModel.create({particapate:[...room.users]})
        }

        await ConversationModel.updateOne({_id:conversation._id},{$push:{messages:messageCreated._id}})
        await RoomModel.updateOne({roomName},{conversation:conversation._id})

        res.status(200).json({status:'success',message:'message has been sent',data:messageCreated})
    } catch (error) {
        console.log(error);
        res.status(400).json({status:'failed',message:'failed to send a message'})
    }

}



export const getMessages = async (req:Request,res:Response)=>{
    const {recieverId} = req.params
    const senderId = req.user._id

    try {
        // search if reciever exist
        const exist = await UserModel.find({_id:recieverId})
        if(!exist){
            res.status(400).json({status:'failed',message:"user doesn't exist"})
            return
        }

        // Get Messages between revierver and sender
        const messages = await ConversationModel.findOne({particapate:{$all:[senderId,recieverId]}}).populate('messages')

        res.status(200).json({status:'success',message:'messages found',data:messages})
        return
    } catch (error) {
        console.log(error);
        res.status(400).json({status:'failed',message:'failed to get messages'})
        return
    }

}

export const getMessagesRoom = async (req:Request,res:Response)=>{
    const {roomName} = req.params

    try {
        // search if Room exist
        const room = await RoomModel.findOne({roomName})
        if(!room){
            res.status(400).json({status:'failed',message:"Room doesn't exist"})
            return
        }

        // Get Messages From Room
        const messages = await ConversationModel.findOne({_id:room.conversation}).populate('messages')
        res.status(200).json({status:'success',message:'messages found',data:messages})
    } catch (error) {
        console.log(error);
        res.status(400).json({status:'failed',message:'failed to get messages'})
    }

}
