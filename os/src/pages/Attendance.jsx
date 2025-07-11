import { useState } from 'react';

function Attendance() {
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState('');
  const [isInsideCampus, setIsInsideCampus] = useState(false);

  const checkIn = async () => {
    if (!navigator.geolocation) {
      setStatus('Geolocation is not supported.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });

        const COLLEGE_LAT = 11.3788;
        const COLLEGE_LNG = 77.7055;
        const RADIUS_KM = 0.1; // ~100 meters

        const distance = getDistanceFromLatLonInKm(latitude, longitude, COLLEGE_LAT, COLLEGE_LNG);

        if (distance <= RADIUS_KM) {
          setIsInsideCampus(true);
          setStatus('✅ Inside campus. Attendance marked.');

          // 🔜 Send data to backend here
          // await fetch('/api/attendance', { ... });
        } else {
          setIsInsideCampus(false);
          setStatus('❌ Outside campus. Cannot mark attendance.');
        }
      },
      () => setStatus('Unable to get location')
    );
  };

  // Utility: distance between two coordinates
  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📍 Attendance with Geofencing</h1>
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        onClick={checkIn}
      >
        Mark Attendance
      </button>

      <p className="mt-4 font-medium">{status}</p>

      {location && (
        <div className="mt-2 text-sm text-gray-500">
          Your location: {location.latitude}, {location.longitude}
        </div>
      )}
    </div>
  );
}

export default Attendance;
