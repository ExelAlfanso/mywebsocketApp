import express from "express";
import { messages, chatRooms } from "../controllers/chatController.js";

const router = express.Router();
router.get("/messages", messages);
router.get("/chatrooms", chatRooms);

export default router;
