import express from "express";
import {
  updateUser,
  uploadAvatar,
  uploadAvatarMiddleware,
  getAvatarUrl,
} from "../controllers/profileController.js";
import authenticateToken from "../middlewares/authMiddleware.js";

const router = express.Router();
router.put(
  "/:userId/uploadAvatar",
  authenticateToken,
  uploadAvatarMiddleware,
  uploadAvatar
);
router.get("/:userId/avatar", getAvatarUrl);
router.put("/:userId/update", authenticateToken, updateUser);
export default router;
