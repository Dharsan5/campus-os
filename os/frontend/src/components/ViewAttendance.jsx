import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const ViewAttendance = () => {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/attendance")
      .then((res) => res.json())
      .then((data) => {
        setRecords(data);
        setFiltered(data);
      })
      .catch((err) => console.error("❌ Failed to load attendance", err));
  }, []);

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearch(keyword);
    setFiltered(
      records.filter(
        (rec) =>
          rec.userId.toLowerCase().includes(keyword) ||
          rec.status.toLowerCase().includes(keyword)
      )
    );
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filtered);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    XLSX.writeFile(wb, "attendance_records.xlsx");
  };

  return (
    <div className="p-8 min-h-screen bg-[#1e1e2f] text-white">
      <h1 className="text-4xl font-extrabold text-center text-violet-400 mb-8 flex justify-center items-center gap-2">
        📄 Attendance Records
      </h1>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="🔍 Search by ID or Status"
          value={search}
          onChange={handleSearch}
          className="w-full sm:w-2/3 px-4 py-2 rounded bg-[#2a2a3b] text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <button
          onClick={exportToExcel}
          className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded shadow-md transition-all"
        >
          ⬇️ Export Excel
        </button>
      </div>

      <p className="text-sm text-gray-400 mb-2">
        Showing {filtered.length} out of {records.length} records.
      </p>

      <div className="overflow-x-auto rounded-lg shadow border border-gray-600 bg-[#2a2a3b]">
        <table className="min-w-full text-sm text-white">
          <thead className="bg-[#3a3a4f] sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left font-medium">👤 User ID</th>
              <th className="px-6 py-3 text-left font-medium">📍 Latitude</th>
              <th className="px-6 py-3 text-left font-medium">📍 Longitude</th>
              <th className="px-6 py-3 text-left font-medium">✅ Status</th>
              <th className="px-6 py-3 text-left font-medium">🕒 Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600">
            {filtered.length > 0 ? (
              filtered.map((rec, idx) => (
                <tr key={idx} className="hover:bg-[#44445a]">
                  <td className="px-6 py-4">{rec.userId}</td>
                  <td className="px-6 py-4">{rec.latitude}</td>
                  <td className="px-6 py-4">{rec.longitude}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        rec.status === "inside"
                          ? "bg-green-600 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {rec.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(rec.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-400">
                  😕 No attendance records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewAttendance;
