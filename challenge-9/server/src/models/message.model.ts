import { Schema,model } from "mongoose";

const MsgSchema = new Schema({
    message:String,
    filePath:String
},{_id:false})

const MessageSchema = new Schema({
    senderId:{
        type:String,
        required:true
    },
    recieverId:{
        type:String,
        required:true
    },
    message:{
        type:MsgSchema,
        required:true
    },
    
},{timestamps:true})

const MessageModel = model('Message',MessageSchema)

export default MessageModel