import React from 'react';

const Dashboard = () => (
  <div className="glass-card w-full max-w-3xl mx-auto flex flex-col items-center justify-center gap-6 mt-8">
    <h2 className="text-3xl font-bold text-violet-300 mb-2 flex items-center gap-2">🏠 Welcome to CampusOS!</h2>
    <div className="flex flex-wrap gap-6 justify-center w-full">
      <div className="glass-card flex flex-col items-center p-6 min-w-[140px]">
        <span className="text-2xl mb-2">📍</span>
        <span className="font-semibold text-lg text-violet-200">Mark Attendance</span>
        <span className="text-xs text-gray-400">Geofence enabled</span>
      </div>
      <div className="glass-card flex flex-col items-center p-6 min-w-[140px]">
        <span className="text-2xl mb-2">📋</span>
        <span className="font-semibold text-lg text-violet-200">Attendance List</span>
        <span className="text-xs text-gray-400">All records</span>
      </div>
      <div className="glass-card flex flex-col items-center p-6 min-w-[140px]">
        <span className="text-2xl mb-2">📝</span>
        <span className="font-semibold text-lg text-violet-200">Notes</span>
        <span className="text-xs text-gray-400">Your notes</span>
      </div>
    </div>
    <div className="mt-4 text-center text-gray-400 text-sm">Explore features using the sidebar navigation.</div>
  </div>
);

export default Dashboard; 