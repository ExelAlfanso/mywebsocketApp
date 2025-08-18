import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import chatRoutes from "./routes/chat.js";
import connectToDB from "./db.js";
import socketHandler from "./socketHandler.js";
import dotenv from "dotenv";
dotenv.config();

// console.log("ENV FILE PATH:", process.cwd());
// console.log("JWT_SECRET from dotenv:", process.env.JWT_SECRET);

const app = express();
const port = process.env.PORT;

const server = http.createServer(app);

const allowedOrigins = [
  `http://localhost:3000`,
  "https://chatify-roan.vercel.app",
];
export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  },
});

socketHandler(io);

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", chatRoutes);
app.use("/api/users", profileRoutes);

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

server.listen(port, async () => {
  await connectToDB();
  console.log(`🚀 Server running at http://localhost:${port}`);
});
