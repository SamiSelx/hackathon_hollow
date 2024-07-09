import { Schema,model } from "mongoose";

const RoomSchema = new Schema({
    roomName:{
        type:String,
        required:true,
        unique:true
    },
    users:[{
        type:Schema.Types.ObjectId,
        ref:'User'
    }],
    conversation:{
        type:Schema.Types.ObjectId,
        ref:'Conversation',
    }
},{
    timestamps:true
})

const RoomModel = model('Room',RoomSchema)

export default RoomModel