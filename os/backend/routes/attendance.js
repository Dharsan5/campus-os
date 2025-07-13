import express from "express";
import Attendance from "../models/Attendance.js";

const router = express.Router();

// GET /api/attendance
router.get("/", async (req, res) => {
  try {
    const records = await Attendance.find();
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch attendance records" });
  }
});

export default router;
