import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import User from "../models/User.js";
import supabase from "../supabaseClient.js";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!user || !isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    console.log("JWT_SECRET: ", JWT_SECRET);
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    const cookieStr = serialize("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    res.setHeader("Set-Cookie", cookieStr);
    return res.status(200).json({ message: "Login successful!" });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    const cookieStr = serialize("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    res.setHeader("Set-Cookie", cookieStr);
    return res
      .status(200)
      .json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: "User not found." });
    let avatarUrl = null;
    if (user.avatar) {
      const { data } = await supabase.storage
        .from("avatars")
        .createSignedUrl(user.avatar, 60 * 60);
      avatarUrl = data.signedUrl;
    }

    return res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      avatar: avatarUrl,
    });
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong." });
  }
};

export const logout = (req, res) => {
  const serialized = serialize("accessToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: 0,
  });

  res.setHeader("Set-Cookie", serialized);
  return res.status(200).json({ message: "Logged out successfully." });
};
