import mongoose from "mongoose";
import ChatRoom from "./models/ChatRoom.js";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function seedRooms() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const testRooms = [
      { roomID: "general", name: "General Chat" },
      { roomID: "gaming", name: "Gaming Room" },
      { roomID: "tech", name: "Tech Talk" },
      { roomID: "music", name: "Music Lovers" },
      { roomID: "study", name: "Study Room" },
    ];

    for (const room of testRooms) {
      const exists = await ChatRoom.findOne({ roomID: room.roomID });
      if (exists) {
        console.log(`⚠️  Skipped "${room.name}" (already exists)`);
      } else {
        await ChatRoom.create(room);
        console.log(`✅ Inserted "${room.name}"`);
      }
    }
    await ChatRoom.insertMany(testRooms);
    console.log("✅ Inserted test rooms");

    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error seeding rooms:", err);
    mongoose.disconnect();
  }
}

seedRooms();
