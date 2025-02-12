import express from "express";
import { getUser, updateUser, uploadPhoto } from "../controllers/user.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/:userId", verifyToken, getUser);
router.patch("/:userId", verifyToken, updateUser);
router.post("/:userId/photo", verifyToken, uploadPhoto);

export default router;
