import { useEffect, useState } from "react";

const AttendanceList = () => {
  const [attendance, setAttendance] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/attendance")
      .then((res) => res.json())
      .then((data) => {
        setAttendance(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Fetch error:", err);
        setLoading(false);
      });
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const filtered = attendance.filter(
    (a) =>
      a.userId?.toLowerCase().includes(search.toLowerCase()) ||
      a.status?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="glass-card w-full max-w-5xl mx-auto text-white mt-8">
      <h2 className="text-2xl font-bold text-violet-300 mb-4 flex items-center gap-2">📋 Attendance List</h2>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4 w-full">
        <input
          type="text"
          placeholder="🔍 Search by ID or Status"
          value={search}
          onChange={handleSearch}
          className="modern-input w-full sm:w-2/3"
        />
      </div>
      {loading ? (
        <div className="modern-state-bg min-h-[180px]">
          <span className="modern-illustration" role="img" aria-label="Loading">⏳</span>
          <div className="spinner mb-4"></div>
          <span className="text-violet-400 text-lg font-semibold mt-2">Loading attendance records...</span>
        </div>
      ) : (
        <div className="overflow-x-auto max-h-[500px] w-full">
          <table className="modern-table min-w-[600px] sm:min-w-full text-xs sm:text-sm text-white">
            <thead className="bg-[#3a3a4f] sticky top-0 z-10">
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
                filtered
                  .slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage)
                  .map((a, idx) => (
                    <tr key={idx} className={`modern-table-row ${idx % 2 === 0 ? 'bg-[#23233a]' : 'bg-[#2a2a3b]'}`}>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 flex items-center gap-2 sm:gap-3">
                        <span className="avatar-gradient-border">
                          <span className="view-attendance-avatar" aria-label={`Avatar for ${a.userId}`}>{a.userId?.charAt(0)?.toUpperCase()}</span>
                        </span>
                        {a.userId}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">{a.latitude}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">{a.longitude}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <span className={`modern-badge ${a.status === "inside" ? "modern-badge-inside" : "modern-badge-outside"}`}>
                          {a.status === "inside" ? (
                            <span role="img" aria-label="Present" style={{fontSize: '1.1em', filter: 'drop-shadow(0 1px 2px #22c55e88)'}}>✔️</span>
                          ) : (
                            <span role="img" aria-label="Absent" style={{fontSize: '1.1em', filter: 'drop-shadow(0 1px 2px #ef444488)'}}>❌</span>
                          )}
                          {a.status}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">{new Date(a.timestamp).toLocaleString()}</td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-400 text-xs sm:text-base">
                    <div className="modern-state-bg">
                      <span className="modern-illustration" role="img" aria-label="No records">🗒️</span>
                      <span className="font-semibold text-violet-500">No attendance records found.</span>
                      <span className="text-xs text-gray-500">Try adjusting your search.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {/* Pagination Controls */}
      {filtered.length > recordsPerPage && (
        <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="modern-btn text-xs sm:text-base disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: Math.ceil(filtered.length / recordsPerPage) }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`modern-btn text-xs sm:text-base font-bold ${currentPage === i + 1 ? 'ring-2 ring-violet-400' : ''}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(Math.ceil(filtered.length / recordsPerPage), p + 1))}
            disabled={currentPage === Math.ceil(filtered.length / recordsPerPage)}
            className="modern-btn text-xs sm:text-base disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AttendanceList;
