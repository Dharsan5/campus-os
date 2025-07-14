import { Routes, Route } from "react-router-dom";
import Attendance from "../components/Attendance";
import AttendanceList from "../components/AttendanceList";
import ViewAttendance from "../components/ViewAttendance";
import Dashboard from "../pages/Dashboard";
import Notes from "../pages/Notes";
import Layout from "../components/Layout";

const AppRoutes = () => (
  <Layout>
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/attendance" element={<Attendance />} />
      <Route path="/attendance-list" element={<AttendanceList />} />
      <Route path="/records" element={<ViewAttendance />} />
      <Route path="/notes" element={<Notes />} />
    </Routes>
  </Layout>
);

export default AppRoutes;
