import express from "express";
import {
  getUserNotifications,
  getUnreadCount,
  createNotification,
  createBulkNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
} from "../controllers/notification.js";

const router = express.Router();

// Get notifications
router.get("/:userId", getUserNotifications);
router.get("/:userId/unread-count", getUnreadCount);

// Create notifications
router.post("/", createNotification);
router.post("/bulk", createBulkNotifications);

// Mark as read
router.patch("/:id/read", markAsRead);
router.patch("/:userId/read-all", markAllAsRead);

// Delete notifications
router.delete("/:id", deleteNotification);
router.delete("/:userId/clear-all", clearAllNotifications);

export default router;
