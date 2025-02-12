import mongoose from "mongoose";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import dotenv from "dotenv";

dotenv.config();

const mockNotifications = [
  {
    type: "new_user",
    message: "New customer John Doe has registered",
    icon: "person_add"
  },
  {
    type: "new_order",
    message: "New order #1234 received for $599",
    icon: "shopping_cart"
  },
  {
    type: "alert",
    message: "System maintenance scheduled for tonight at 10 PM",
    icon: "warning"
  },
  {
    type: "message",
    message: "You have a new message from support team",
    icon: "message"
  },
  {
    type: "new_user",
    message: "New customer Alice Smith has registered",
    icon: "person_add"
  },
  {
    type: "alert",
    message: "Low inventory alert: Gaming Laptops",
    icon: "inventory"
  },
  {
    type: "new_order",
    message: "Bulk order received from Tech Corp",
    icon: "shopping_cart"
  },
  {
    type: "message",
    message: "Customer feedback received: 5-star rating",
    icon: "star"
  }
];

const addMockNotifications = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Get all admin users
    const adminUsers = await User.find({ role: "admin" });
    
    if (adminUsers.length === 0) {
      console.log("No admin users found. Please create admin users first.");
      process.exit(1);
    }

    console.log(`Found ${adminUsers.length} admin users`);

    // Create notifications for each admin
    const notifications = [];
    for (const admin of adminUsers) {
      for (const mock of mockNotifications) {
        // Add some random timing within the last 24 hours
        const hoursAgo = Math.floor(Math.random() * 24);
        const minutesAgo = Math.floor(Math.random() * 60);
        const created_at = new Date(Date.now() - (hoursAgo * 60 * 60 * 1000) - (minutesAgo * 60 * 1000));

        notifications.push({
          user_id: admin._id,
          message: mock.message,
          type: mock.type,
          icon: mock.icon,
          is_read: Math.random() > 0.7, // 30% chance of being unread
          is_deleted: false,
          created_at,
          updated_at: created_at
        });
      }
    }

    // Clear existing notifications
    await Notification.deleteMany({});

    // Insert new notifications
    await Notification.insertMany(notifications);

    console.log(`Successfully added ${notifications.length} notifications`);
    process.exit(0);
  } catch (error) {
    console.error("Error adding mock notifications:", error);
    process.exit(1);
  }
};

addMockNotifications();
