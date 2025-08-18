import express from "express";
import {
  updateUser,
  uploadAvatar,
  uploadAvatarMiddleware,
} from "../controllers/profileController.js";
import authenticateToken from "../middlewares/authMiddleware.js";

const router = express.Router();
router.put(
  "/:userId/avatar",
  authenticateToken,
  uploadAvatarMiddleware,
  uploadAvatar
);
router.put("/:userId/update", authenticateToken, updateUser);
export default router;
