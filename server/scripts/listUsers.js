import mongoose from "mongoose";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const listUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const users = await User.find({});
    console.log("Users found:", users.length);
    users.forEach(user => {
      console.log(`ID: ${user._id}, Name: ${user.name}, Role: ${user.role}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

listUsers();
