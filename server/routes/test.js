import express from "express";
import { createNotificationForAdmins, createNotificationForUser } from "../utils/notificationHelper.js";

const router = express.Router();

// Test endpoint to create a notification for all admins
router.post("/notify-admins", async (req, res) => {
  try {
    const notifications = await createNotificationForAdmins(
      "new_user",
      "New customer John Doe has registered",
      "person_add"
    );
    res.status(201).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Test endpoint to create a notification for a specific user
router.post("/notify-user/:userId", async (req, res) => {
  try {
    const notification = await createNotificationForUser(
      req.params.userId,
      "message",
      "You have a new message from support",
      "message"
    );
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
