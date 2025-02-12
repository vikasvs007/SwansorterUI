import mongoose from "mongoose";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { mockNotifications } from "./notifications.js";
import dotenv from "dotenv";

dotenv.config();

const seedNotifications = async () => {
  try {
    // Connect to MongoDB
    const MONGO_URL = process.env.MONGO_URL;
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear existing notifications
    await Notification.deleteMany({});

    // Get all admin users
    const adminUsers = await User.find({ role: "admin" });
    const adminIds = adminUsers.map(admin => admin._id);

    if (adminIds.length === 0) {
      console.log("No admin users found. Please create admin users first.");
      process.exit(1);
    }

    // Generate mock notifications
    const notifications = mockNotifications(adminIds);

    // Insert notifications
    await Notification.insertMany(notifications);

    console.log(`Successfully seeded ${notifications.length} notifications`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding notifications:", error);
    process.exit(1);
  }
};

seedNotifications();
