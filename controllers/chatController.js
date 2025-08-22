import Message from "../models/Message.js";
import ChatRoom from "../models/ChatRoom.js";
import { io } from "../index.js";
export const messages = async (req, res) => {
  try {
    const { roomID } = req.query;
    if (!roomID) return res.status(400).json({ error: "roomID required" });
    const messages = await Message.find({ roomID });
    return res.status(200).json({ messages });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

export const chatRooms = async (req, res) => {
  try {
    const rooms = await ChatRoom.find().lean();
    const roomsWithCount = rooms.map((room) => {
      const socketRoom = io.sockets.adapter.rooms.get(room.roomID);
      return { ...room, count: socketRoom ? socketRoom.size : 0 };
    });
    return res.status(200).json({ rooms: roomsWithCount });
  } catch (err) {
    console.error("Error fetching rooms:", err);
    return res.status(500).json({ error: err });
  }
};
