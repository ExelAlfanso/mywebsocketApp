// updatedUser.js
import mongoose from "mongoose";
import User from "./models/User.js";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI; // change to your DB name

async function updateUser() {
  try {
    // 1️⃣ Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // 2️⃣ Update the user
    const updated = await User.findOneAndUpdate(
      { _id: "6892ac667e425f93bd642fac" }, // your user ID
      { avatar: "https://example.com/my-avatar.jpg" }
      //   { new: true }
    );

    console.log("Updated User:", updated);

    // 3️⃣ Close connection
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

updateUser();
