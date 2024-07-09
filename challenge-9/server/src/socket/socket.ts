import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

export const app = express();
export const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONT_URL!
  },
});
type UserSockets = { id: string; socketId: string }[];


let onlineUser:UserSockets = []

io.on("connection", async (socket) => {
  console.log("User Connected ", socket.id);
  socket.on("join-room", (rooms: string[]) => {
    console.log("rooms", rooms);
    rooms?.forEach((room) => {
      socket.join(room);
    });
  });

  socket.on("message-dm", (message) => {
    console.log("dm messg: ", message);
    socket.to(message.recieverId).emit("recieve-message", message);
  });


  socket.on("addOnlineUser", (userId) => {
    const exist = onlineUser?.find((user) => user.id == userId);
    if (!exist) onlineUser?.push({ id: userId, socketId: socket.id });
    io.emit("getOnlineUsers", onlineUser);
    console.log("userId", userId, onlineUser);
  });


  // second method using DB
  // socket.on('offline',async userId=>{
  //   console.log('user is disconnected',userId);
  //   if(userId) await UserModel.updateOne({_id:userId})
  //   socket.broadcast.emit('offline-user',userId)
  // })




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
