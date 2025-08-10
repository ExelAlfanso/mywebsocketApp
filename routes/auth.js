import express from "express";
import { register, login, me, logout } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import signUpMiddleware from "../middlewares/signUpMiddleware.js";
const router = express.Router();

router.post("/register", signUpMiddleware, register);
router.post("/login", login);
router.get("/me", authMiddleware, me);
router.post("/logout", logout);

export default router;
