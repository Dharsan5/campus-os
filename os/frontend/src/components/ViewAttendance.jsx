import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const ViewAttendance = () => {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/attendance")
      .then((res) => res.json())
      .then((data) => {
        setRecords(data);
        setFiltered(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to load attendance", err);
        setLoading(false);
      });
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

  const handleDateFilter = (start, end) => {
    let filteredRecords = records;
    if (start) {
      filteredRecords = filteredRecords.filter(
        (rec) => new Date(rec.timestamp) >= new Date(start)
      );
    }
    if (end) {
      filteredRecords = filteredRecords.filter(
        (rec) => new Date(rec.timestamp) <= new Date(end)
      );
    }
    if (search) {
      filteredRecords = filteredRecords.filter(
        (rec) =>
          rec.userId.toLowerCase().includes(search) ||
          rec.status.toLowerCase().includes(search)
      );
    }
    setFiltered(filteredRecords);
    setCurrentPage(1); // Reset to first page on filter
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    handleDateFilter(e.target.value, endDate);
  };
  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    handleDateFilter(startDate, e.target.value);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filtered);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    XLSX.writeFile(wb, "attendance_records.xlsx");
  };

  return (
    <div className="gradient-bg min-h-screen p-6 sm:p-8 flex items-center justify-center">
      <div className="glass-card w-full mx-auto max-w-5xl text-white">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-violet-400 mb-6 sm:mb-8 flex justify-center items-center gap-2" id="attendance-heading">
           ATTENDANCE RECORDS
        </h1>

        {/* Loading State */}
        {loading ? (
          <div className="modern-state-bg min-h-[220px]">
            <span className="modern-illustration" role="img" aria-label="Loading">⏳</span>
            <div className="spinner mb-4"></div>
            <span className="text-violet-400 text-lg font-semibold mt-2">Loading attendance records...</span>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4 w-full" aria-label="Attendance filters and actions">
              <div className="flex flex-col sm:flex-row gap-2 items-center w-full sm:w-auto" role="group" aria-labelledby="date-filter-label">
                <span id="date-filter-label" className="sr-only">Date range filter</span>
                <label htmlFor="start-date" className="text-xs sm:text-sm text-gray-300">From:</label>
                <input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  className="modern-input text-xs sm:text-sm w-full sm:w-auto"
                  aria-label="Start date"
                />
                <label htmlFor="end-date" className="text-xs sm:text-sm text-gray-300">To:</label>
                <input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  className="modern-input text-xs sm:text-sm w-full sm:w-auto"
                  aria-label="End date"
                />
              </div>
              <button
                onClick={exportToExcel}
                className="modern-btn-green w-full sm:w-auto text-sm sm:text-base"
                aria-label="Export attendance records to Excel"
              >
                Export 
              </button>
            </div>

            <p className="text-sm text-gray-400 mb-2">
              Showing {filtered.length} out of {records.length} records.
            </p>

            <div className="overflow-x-auto max-h-[500px] w-full" role="region" aria-labelledby="attendance-heading">
              <table className="modern-table min-w-[600px] sm:min-w-full text-xs sm:text-sm text-white" aria-describedby="attendance-heading">
                <thead className="bg-[#3a3a4f] sticky top-0 z-10">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left font-medium">User ID</th>
                    <th scope="col" className="px-6 py-3 text-left font-medium">Latitude</th>
                    <th scope="col" className="px-6 py-3 text-left font-medium">Longitude</th>
                    <th scope="col" className="px-6 py-3 text-left font-medium">Status</th>
                    <th scope="col" className="px-6 py-3 text-left font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600">
                  {!loading && filtered.length > 0 ? (
                    filtered
                      .slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage)
                      .map((rec, idx) => (
                        <tr
                          key={idx + (currentPage - 1) * recordsPerPage}
                          className={`modern-table-row ${idx % 2 === 0 ? 'bg-[#23233a]' : 'bg-[#2a2a3b]'}`}
                        >
                        <td className="px-3 sm:px-6 py-3 sm:py-4 flex items-center gap-2 sm:gap-3" aria-label={`User ID: ${rec.userId}`}>
                          <span className="avatar-gradient-border">
                            <span
                              className="view-attendance-avatar"
                              aria-label={`Avatar for ${rec.userId}`}
                            >
                              {rec.userId?.charAt(0)?.toUpperCase()}
                            </span>
                          </span>
                          {rec.userId}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4" aria-label={`Latitude: ${rec.latitude}`}>{rec.latitude}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4" aria-label={`Longitude: ${rec.longitude}`}>{rec.longitude}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4" aria-label={`Status: ${rec.status}`}>
                          <span
                            className={`modern-badge ${rec.status === "inside" ? "modern-badge-inside" : "modern-badge-outside"}`}
                            aria-label={rec.status === "inside" ? "Inside" : "Outside"}
                          >
                            {rec.status === "inside" ? (
                              <span role="img" aria-label="Present" style={{fontSize: '1.1em', filter: 'drop-shadow(0 1px 2px #22c55e88)'}}>✔️</span>
                            ) : (
                              <span role="img" aria-label="Absent" style={{fontSize: '1.1em', filter: 'drop-shadow(0 1px 2px #ef444488)'}}>❌</span>
                            )}
                            {rec.status}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4" aria-label={`Date: ${new Date(rec.timestamp).toLocaleString()}`}>
                          {new Date(rec.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : !loading ? (
                    <tr>
                      <td colSpan="5" className="text-center py-6 text-gray-400 text-xs sm:text-base" aria-live="polite">
                        <div className="modern-state-bg">
                          <span className="font-semibold text-violet-500">No attendance records found.</span>
                          <span className="text-xs text-gray-500">Try adjusting your filters or date range.</span>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
            {/* Pagination Controls */}
            {filtered.length > recordsPerPage && (
              <div className="flex flex-wrap justify-center items-center gap-2 mt-4" role="navigation" aria-label="Attendance pagination">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="modern-btn text-xs sm:text-base disabled:opacity-50"
                  aria-label="Previous page"
                >
                  Prev
                </button>
                {Array.from({ length: Math.ceil(filtered.length / recordsPerPage) }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`modern-btn text-xs sm:text-base font-bold ${currentPage === i + 1 ? 'ring-2 ring-violet-400' : ''}`}
                    aria-label={`Go to page ${i + 1}`}
                    aria-current={currentPage === i + 1 ? "page" : undefined}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(Math.ceil(filtered.length / recordsPerPage), p + 1))}
                  disabled={currentPage === Math.ceil(filtered.length / recordsPerPage)}
                  className="modern-btn text-xs sm:text-base disabled:opacity-50"
                  aria-label="Next page"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ViewAttendance;
