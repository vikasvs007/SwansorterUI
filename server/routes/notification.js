import express from "express";
import {
  getUserNotifications,
  createNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../controllers/notification.js";

const router = express.Router();

// Get all notifications for a user
router.get("/:userId", getUserNotifications);

// Create a new notification
router.post("/", createNotification);

// Mark a notification as read
router.patch("/:id/read", markNotificationAsRead);

// Mark all notifications as read for a user
router.patch("/:userId/read-all", markAllNotificationsAsRead);

// Delete a notification
router.delete("/:id", deleteNotification);

export default router;
