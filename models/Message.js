import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
  senderUsername: {
    type: String,
    required: true,
  },
  content: { type: String, required: true },
  timeStamp: { type: Date, default: Date.now },
});
const Message = mongoose.model("Message", messageSchema);
export default Message;
