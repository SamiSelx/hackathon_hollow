import mongoose from "mongoose";

interface RoomI{
    roomName:string;
    users:mongoose.Types.ObjectId[];
    conversation:mongoose.Types.ObjectId
}