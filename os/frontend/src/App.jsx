import { BrowserRouter, Routes, Route } from "react-router-dom";
import Attendance from "./components/Attendance";
import ViewAttendance from "./components/ViewAttendance";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/records" element={<ViewAttendance />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
