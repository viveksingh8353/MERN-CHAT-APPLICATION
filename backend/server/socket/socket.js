// server/socket/socket.js
import { Server } from "socket.io";

const userSocketMap = {}; // userId => socketId

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

export const socketSetup = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ a user connected:", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId !== "undefined") {
      userSocketMap[userId] = socket.id;
    }

    io.emit("getOnlineUser", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log("❌ user disconnected:", socket.id);
      delete userSocketMap[userId];
      io.emit("getOnlineUser", Object.keys(userSocketMap));
    });
  });
};
