import Message from "../models/Message.js";
import ChatRoom from "../models/ChatRoom.js";
export const messages = async (req, res) => {
  try {
    const { roomID } = req.query;
    if (!roomID) return res.status(400).json({ message: "roomID required" });
    const messages = await Message.find({ roomID });
    return res.status(200).json({ messages });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

export const chatRooms = async (req, res) => {
  try {
    const rooms = await ChatRoom.find();
    return res.status(200).json({ rooms });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};
