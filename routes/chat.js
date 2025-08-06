import express from "express";
import { messages } from "../controllers/chatController.js";

const router = express.Router();
router.get("/messages", messages);

export default router;
