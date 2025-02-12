import Notification from "../models/Notification.js";
import User from "../models/User.js";

// Get all notifications for a user with pagination and filters
export const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, type, isRead } = req.query;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {
      user_id: userId,
      is_deleted: false
    };

    if (type) filter.type = type;
    if (isRead !== undefined) filter.is_read = isRead === 'true';

    const notifications = await Notification.find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Notification.countDocuments(filter);

    res.status(200).json({
      notifications,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Get unread notifications count
export const getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.params;
    const count = await Notification.countDocuments({
      user_id: userId,
      is_read: false,
      is_deleted: false
    });
    res.status(200).json({ count });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Create a new notification
export const createNotification = async (req, res) => {
  try {
    const { user_id, message, type = 'alert', icon = 'notification' } = req.body;

    // Validate user existence
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newNotification = new Notification({
      user_id,
      message,
      type,
      icon,
      is_read: false,
      is_deleted: false
    });

    const savedNotification = await newNotification.save();
    res.status(201).json(savedNotification);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// Create notifications for multiple users
export const createBulkNotifications = async (req, res) => {
  try {
    const { userIds, message, type = 'alert', icon = 'notification' } = req.body;

    // Validate users existence
    const users = await User.find({ _id: { $in: userIds } });
    if (users.length !== userIds.length) {
      return res.status(404).json({ message: "Some users not found" });
    }

    const notifications = userIds.map(userId => ({
      user_id: userId,
      message,
      type,
      icon,
      is_read: false,
      is_deleted: false
    }));

    const savedNotifications = await Notification.insertMany(notifications);
    res.status(201).json(savedNotifications);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// Mark a notification as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      id,
      { is_read: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    
    res.status(200).json(notification);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Mark all notifications as read for a user
export const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await Notification.updateMany(
      { 
        user_id: userId, 
        is_read: false,
        is_deleted: false 
      },
      { is_read: true }
    );
    res.status(200).json({ 
      message: "All notifications marked as read",
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Delete a notification (soft delete)
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      id,
      { is_deleted: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Clear all notifications for a user (soft delete)
export const clearAllNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await Notification.updateMany(
      { user_id: userId, is_deleted: false },
      { is_deleted: true }
    );
    res.status(200).json({ 
      message: "All notifications cleared",
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
