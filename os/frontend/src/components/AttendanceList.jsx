import { useEffect, useState } from "react";

const AttendanceList = () => {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/attendance")
      .then((res) => res.json())
      .then((data) => setAttendance(data))
      .catch((err) => console.error("❌ Fetch error:", err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">📋 Attendance Records</h2>
      <table className="table-auto w-full border border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Student ID</th>
            <th className="border px-4 py-2">Latitude</th>
            <th className="border px-4 py-2">Longitude</th>
            <th className="border px-4 py-2">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((a, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{a.studentId}</td>
              <td className="border px-4 py-2">{a.latitude}</td>
              <td className="border px-4 py-2">{a.longitude}</td>
              <td className="border px-4 py-2">{new Date(a.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceList;
