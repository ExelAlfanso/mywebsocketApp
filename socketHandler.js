import Message from "./models/Message.js";

export default function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("🔌 New Client:", socket.id);

    socket.on("message", async (msg) => {
      console.log("💬 Message received:", msg);

      try {
        const { senderUsername, content } = msg;
        await Message.create({
          senderUsername: senderUsername,
          content,
        });
        io.emit("message", msg);
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
