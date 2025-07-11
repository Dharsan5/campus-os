import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Attendance from "../pages/Attendance";
import Notes from "../pages/Notes";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/attendance" element={<Attendance />} />
      <Route path="/notes" element={<Notes />} />
    </Routes>
  );
}
