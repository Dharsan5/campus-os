import { useEffect, useRef, useState } from "react";

const CAMPUS = { lat: 11.2748, lng: 77.6066, radius: 100 };

function isWithinGeofence(currentLat, currentLng, targetLat, targetLng, maxDistance = 100) {
  const R = 6371e3;
  const φ1 = (currentLat * Math.PI) / 180;
  const φ2 = (targetLat * Math.PI) / 180;
  const Δφ = ((targetLat - currentLat) * Math.PI) / 180;
  const Δλ = ((targetLng - currentLng) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c <= maxDistance;
}

const Attendance = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selfie, setSelfie] = useState(null);
  const [marked, setMarked] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);

  useEffect(() => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ latitude, longitude });
        setStatus(isWithinGeofence(latitude, longitude, CAMPUS.lat, CAMPUS.lng, CAMPUS.radius) ? "inside" : "outside");
        setLoading(false);
      },
      () => {
        setError("Location access denied or failed");
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    if (location.latitude && location.longitude && window.L) {
      const map = window.L.map("attendance-map").setView([CAMPUS.lat, CAMPUS.lng], 17);
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
      // Draw geofence
      window.L.circle([CAMPUS.lat, CAMPUS.lng], {
        color: '#6366f1',
        fillColor: '#a78bfa',
        fillOpacity: 0.18,
        radius: CAMPUS.radius
      }).addTo(map);
      // User marker color
      const inside = status === 'inside';
      const markerIcon = window.L.divIcon({
        className: '',
        html: `<div style="background:${inside ? '#22c55e' : '#ef4444'};width:18px;height:18px;border-radius:50%;border:2.5px solid #fff;box-shadow:0 2px 8px #0002;"></div>`
      });
      window.L.marker([location.latitude, location.longitude], { icon: markerIcon })
        .addTo(map)
        .bindPopup(inside ? 'Present' : 'Absent')
        .openPopup();
      return () => map.remove();
    }
  }, [location.latitude, location.longitude, status]);

  const startCamera = async () => {
    setCameraActive(true);
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch {
      setError("Unable to access camera");
      setCameraActive(false);
    }
  };

  const takeSelfie = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, 240, 180);
      const dataUrl = canvasRef.current.toDataURL("image/png");
      setSelfie(dataUrl);
      if (videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      setCameraActive(false);
    }
  };

  const markAttendance = () => {
    setLoading(true);
    setError("");
    fetch("http://localhost:5000/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "dharsan-001",
        latitude: location.latitude,
        longitude: location.longitude,
        status,
        selfie,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setMarked(true);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to mark attendance");
        setLoading(false);
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen gradient-bg p-4">
      <div className="glass-card w-full max-w-3xl flex flex-col gap-6 items-center p-6 sm:p-8">
        <h2 className="text-3xl font-bold text-white mb-4"> Attendance Portal</h2>

        {loading && (
          <div className="modern-state-bg w-full">
            <span className="modern-illustration"></span>
            <div className="spinner mb-3"></div>
            <p className="text-violet-300 font-medium">Detecting location...</p>
          </div>
        )}

        {error && (
          <div className="modern-state-bg w-full bg-red-100">
            <span className="modern-illustration">❌</span>
            <p className="text-red-500 font-semibold">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="flex flex-col lg:flex-row gap-6 w-full justify-between">
              <div className="flex-1 flex flex-col gap-2 items-center">
                <div id="attendance-map" className="w-full h-[200px] rounded-xl border border-violet-400 shadow-lg"></div>
                <div className="text-center mt-2">
                  <span className={`modern-badge ${status === 'inside' ? 'modern-badge-inside' : 'modern-badge-outside'}`}>{status === 'inside' ? '🟢 Present' : '🔴 Absent'}</span>
                  <p className="text-xs text-gray-300 mt-1">Lat: {location.latitude?.toFixed(5)} | Lng: {location.longitude?.toFixed(5)}</p>
                </div>
              </div>

              <div className="flex-1 flex flex-col items-center gap-3">
                {!selfie && !cameraActive && (
                  <button className="modern-btn w-full" onClick={startCamera}>
                     Launch Camera
                  </button>
                )}

                {cameraActive && (
                  <>
                    <video ref={videoRef} width={240} height={180} className="rounded-xl border border-violet-400" />
                    <canvas ref={canvasRef} width={240} height={180} className="hidden"></canvas>
                    <button className="modern-btn-green w-full" onClick={takeSelfie}>
                       Capture Selfie
                    </button>
                  </>
                )}

                {selfie && (
                  <>
                    <img src={selfie} alt="Selfie" className="rounded-xl border border-violet-400 w-[120px] h-[90px] object-cover" />
                    <button className="modern-btn w-full" onClick={() => setSelfie(null)}>
                       Retake
                    </button>
                  </>
                )}
              </div>
            </div>

            <button
              className="modern-btn-green w-full text-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={markAttendance}
              disabled={status !== "inside" || !selfie || marked}
            >
              {marked ? " Attendance Marked" : " Mark Attendance"}
            </button>

            {marked && (
              <div className="modern-state-bg mt-4">
                <span className="modern-illustration">done</span>
                <p className="text-green-400 font-semibold">Your attendance has been recorded!</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Attendance;
