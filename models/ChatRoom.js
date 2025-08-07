import mongoose from "mongoose";
const chatRoomSchema = new mongoose.Schema({
  roomID: { type: String, required: true },
  name: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);
export default ChatRoom;
