import express from "express";
import { getAdmins, getUserPerformance, createAdmin } from "../controllers/management.js";

const router = express.Router();

router.get("/admins", getAdmins);
router.post("/admin", createAdmin);
router.get("/performance/:id", getUserPerformance);

export default router;
