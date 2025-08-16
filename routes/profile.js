import express from "express";
import {
  updateUser,
  uploadAvatar,
  uploadAvatarMiddleware,
} from "../controllers/profileController.js";
import authenticateToken from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post(
  "/upload-avatar/:userId",
  authenticateToken,
  uploadAvatarMiddleware,
  uploadAvatar
);
router.put("/update", authenticateToken, updateUser);
export default router;
