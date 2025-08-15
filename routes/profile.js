import express from "express";
import {
  uploadAvatar,
  uploadAvatarMiddleware,
} from "../controllers/profileController.js";

const router = express.Router();
router.post("/upload-avatar/:userId", uploadAvatarMiddleware, uploadAvatar);
export default router;
