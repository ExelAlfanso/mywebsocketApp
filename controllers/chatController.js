import Message from "../models/Message.js";

export const messages = async (req, res) => {
  try {
    const messages = await Message.find();
    return res.status(200).json({ messages });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};
