import Notification from "../models/Notification.js";
import User from "../models/User.js";

// Helper function to create a notification for admin users
export const createNotificationForAdmins = async (type, message, icon) => {
  try {
    // Find all admin users
    const adminUsers = await User.find({ role: "admin" });
    
    // Create notifications for each admin
    const notifications = adminUsers.map(admin => ({
      user_id: admin._id,
      message,
      type,
      icon,
      is_read: false,
      is_deleted: false
    }));

    // Insert all notifications
    return await Notification.insertMany(notifications);
  } catch (error) {
    console.error("Error creating admin notifications:", error);
    throw error;
  }
};

// Helper function to create a notification for a specific user
export const createNotificationForUser = async (userId, type, message, icon) => {
  try {
    const notification = new Notification({
      user_id: userId,
      message,
      type,
      icon,
      is_read: false,
      is_deleted: false
    });

    return await notification.save();
  } catch (error) {
    console.error("Error creating user notification:", error);
    throw error;
  }
};
