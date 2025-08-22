import Message from "./models/Message.js";
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
      const chatRoom = io.sockets.adapter.rooms.get(roomID);
      const count = chatRoom ? chatRoom.size : 0;
      io.to(roomID).emit("roomCount", count);
      console.log(`📦 Socket ${socket.id} joined room ${roomID}`);
    });
    socket.on("message", async (msg) => {
      console.log("💬 Message received:", msg);

      try {
        const { roomID, senderUsername, content, avatar } = msg;
        await Message.create({
          roomID,
          senderUsername: senderUsername,
          content,
          avatar,
        });
        io.to(roomID).emit("message", msg);
      } catch (err) {
        console.error("Error saving message: ", err.message);
        socket.emit("error", { message: "Failed to send message." });
      }
    });

    socket.on("disconnect", () => {
      socket.rooms.forEach((roomID) => {
        if (roomID !== socket.id) {
          const room = io.sockets.adapter.rooms.get(roomID);
          const count = room ? room.size : 0;
          io.to(roomID).emit("roomCount", count);
        }
      });
      console.log("❌ Client disconnected:", socket.id);
    });
  });
}
