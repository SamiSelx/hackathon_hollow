import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import RoomModel from "../models/room.modelv2";
import UserModel from "../models/user.model";

export const app = express();
export const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONT_URL!
  },
});
type UserSockets = { id: string; socketId: string }[];


const userSocket = new Map()
let onlineUser:UserSockets = []

io.on("connection", async (socket) => {
  console.log("User Connected ", socket.id);
  socket.on("join-room", (rooms: string[]) => {
    console.log("rooms", rooms);
    rooms?.forEach((room) => {
      socket.join(room);
    });
  });

  socket.on("addOnlineUser", (userId) => {
    const exist = onlineUser?.find((user) => user.id == userId);
    if (!exist) onlineUser?.push({ id: userId, socketId: socket.id });
    io.emit("getOnlineUsers", onlineUser);
    console.log("userId", userId, onlineUser);
  });

  socket.on("online", async (userId) => {
    console.log("user is online", userId);
    userSocket.set(socket.id, userId);
    await UserModel.updateOne({ _id: userId }, { isOnline: true });
    socket.broadcast.emit("status-user", { id: userId, isOnline: true });
  });

  // second method using DB
  // socket.on('offline',async userId=>{
  //   console.log('user is disconnected',userId);
  //   if(userId) await UserModel.updateOne({_id:userId})
  //   socket.broadcast.emit('offline-user',userId)
  // })

  socket.on("message-dm", (message) => {
    console.log("dm messg: ", message);
    socket.to(message.recieverId).emit("recieve-message", message);
  });

  socket.on("message", async (message) => {
    console.log(message, "from ", socket.id);
    // socket.emit('recieved-message',msg + ' from server')
    const message_info = {
      message: message.message,
      author: message.author,
      author_id: message.author_id,
    };
    const exist = await RoomModel.findOne({ roomName: message.room });
    const conversation = exist?.conversation;
    console.log("array : ", conversation);
    !exist
      ? await RoomModel.create({
          roomName: message.room,
          conversation: [{ ...message_info }],
        })
      : await RoomModel.updateMany(
          { roomName: message.room },
          { $push: { conversation: { ...message_info } } }
        );
    message.room === ""
      ? socket.broadcast.emit("recieved-message", message_info)
      : socket.to(message.room).emit("recieved-message", message_info);
  });

  socket.on("disconnect", async (reason) => {
    console.log("User Disconnected ", socket.id, reason);
    onlineUser = onlineUser?.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUser);

    // Second method using DB
    // const userId = userSocket.get(socket.id)
    // if(userId){
    //   await UserModel.updateOne({_id:userId},{isOnline:false})
    //   userSocket.delete(socket.id)
    //   console.log('user is offline',userId);
    //   socket.broadcast.emit('status-user',{id:userId,isOnline:false})

    // }
  });
});
