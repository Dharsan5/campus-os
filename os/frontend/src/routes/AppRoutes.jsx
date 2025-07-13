import { Routes, Route } from "react-router-dom";
import Attendance from "../components/Attendance";
import AttendanceList from "../components/AttendanceList";
import ViewAttendance from "../components/ViewAttendance"; // ✅ FIXED

const AppRoutes = () => (
  <Routes>
    <Route path="/attendance" element={<Attendance />} />
    <Route path="/attendance-list" element={<AttendanceList />} />
    <Route path="/records" element={<ViewAttendance />} />
  </Routes>
);

export default AppRoutes;
