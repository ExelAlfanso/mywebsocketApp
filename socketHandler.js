import Message from "./models/Message.js";
import mongoose from "mongoose";
import ChatRoom from "./models/ChatRoom.js";
export default async function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("🔌 New Client:", socket.id);
    socket.on("join-room", async (roomID) => {
      const room = await ChatRoom.findOne({ roomID });

      if (!room) {
        socket.emit("error", "Invalid room ID.");
        return;
      }
      socket.join(roomID);
      console.log(`📦 Socket ${socket.id} joined room ${roomID}`);
    });
    socket.on("message", async (msg) => {
      console.log("💬 Message received:", msg);

      try {
        const { roomID, senderUsername, content } = msg;
        await Message.create({
          roomID,
          senderUsername: senderUsername,
          content,
        });
        io.to(roomID).emit("message", msg);
      } catch (err) {
        console.error("Error saving message: ", err.message);
        socket.emit("error", { message: "Failed to send message." });
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });
}
