import { useEffect, useState } from "react";

const Attendance = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  // 👇 Geofence check function
  function isWithinGeofence(currentLat, currentLng, targetLat, targetLng, maxDistance = 100) {
    const R = 6371e3; // metres
    const φ1 = (currentLat * Math.PI) / 180;
    const φ2 = (targetLat * Math.PI) / 180;
    const Δφ = ((targetLat - currentLat) * Math.PI) / 180;
    const Δλ = ((targetLng - currentLng) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // in meters
    return distance <= maxDistance;
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ latitude, longitude });

        // ✅ Geofencing coordinates of campus
        const targetLat = 11.3733;
        const targetLng = 77.7182;

        const isInside = isWithinGeofence(latitude, longitude, targetLat, targetLng);

        if (!isInside) {
          alert("🚫 You are outside the geofenced college area.");
          return;
        }

        // ✅ Mark attendance
        fetch("http://localhost:5000/api/attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: "dharsan-001",
            latitude,
            longitude,
            status: "inside",
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("✅ Attendance Marked:", data);
            alert("✅ Attendance marked successfully!");
          })
          .catch((err) => {
            console.error("❌ Error marking attendance:", err);
            alert("❌ Failed to mark attendance");
          });
      },
      (err) => {
        console.error("⚠️ Location error", err);
        alert("⚠️ Location access denied or failed");
      }
    );
  }, []);

  return (
    <div className="p-4 text-center">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">📍 Attendance Page</h2>
      <p className="text-lg">Latitude: {location.latitude}</p>
      <p className="text-lg">Longitude: {location.longitude}</p>
    </div>
  );
};

export default Attendance;
