import mongoose from "mongoose";
import Notification from "../models/Notification.js";
import dotenv from "dotenv";

dotenv.config();

const addTestNotification = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Create a test notification for the admin user
    const notification = new Notification({
      user_id: "67ab741b4ed113b4940fac28", // vikasvs (admin)
      message: "This is a test notification",
      type: "alert",
      icon: "warning",
      is_read: false,
      is_deleted: false,
      created_at: new Date(),
      updated_at: new Date()
    });

    const savedNotification = await notification.save();
    console.log("Notification created successfully:", savedNotification);

    process.exit(0);
  } catch (error) {
    console.error("Error creating notification:", error);
    process.exit(1);
  }
};

addTestNotification();
