import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express()

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
    origin:["http://localhost:5678"]
    }
})

//listen for incomming connections 
io.on("connection", (socket) => {
    // console.log("socket connected", socket.id);


    socket.on("joinRoom", (userId) => {
      socket.join(userId);
      // console.log(`User ${userId} joined room ${userId}`);
    });

    socket.on("leaveRoom", (userId) => {
      socket.leave(userId);
      // console.log(`User ${userId} left room ${userId}`);
    });

    socket.on("newPrivateMessage", (msg) => { 
        
      io.to(msg.receiver).emit("newPrivateMessage", msg);
      io.to(msg.sender).emit("newPrivateMessage", msg);

    });
    
    //listen for disconnections
    socket.on("disconnect", () => {
        // console.log("disconnected socket");
    })
})
export { io, app, server };