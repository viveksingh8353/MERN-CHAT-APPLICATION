import {Server} from 'socket.io'
import express from 'express'
import http from 'http'


const app=express()

const server =http.createServer(app)

const io = new Server(server, {
    cors:{
        origin:["http://localhost:5173"],
        methods:["GET","POST"]
    }
})
 export const getReceiverSocketId=(receiverId)=>{
    return userSocketMap[receiverId]
 }

const userSocketMap={}
io.on("connection",(socket)=>{
    console.log("a user connected",socket.id)
      
    const userId =socket.handshake.query.userId
    //  console.log(userId)
     if(userId !=="undefined"){
         userSocketMap[userId]=socket.id
     }
      // io.emit events send to all the connected clients
      io.emit("getOnlineUser",Object.keys(userSocketMap))


    socket.on("disconnect",()=>{
        console.log("user disconnected",socket.id)
        delete userSocketMap[userId]
        io.emit("getOnlineUser",Object.keys(userSocketMap))
    })
})
export {app,server,io}