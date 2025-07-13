import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  userId: String,
  latitude: Number,
  longitude: Number,
  status: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});


export default mongoose.model("Attendance", attendanceSchema);
