// ✅ ES Module imports
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// ⚠️ If you're importing local files, always include `.js`
import attendanceRoutes from "./routes/attendance.js";

// ✅ Load .env file
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/attendance", attendanceRoutes);

// ✅ Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT, () =>
      console.log(`🚀 Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
