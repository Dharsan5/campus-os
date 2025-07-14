import React from 'react';

const Header = () => (
  <header className="glass-card flex items-center justify-between px-6 py-3 mb-6 w-full shadow-md">
    <div className="flex items-center gap-3">
      <span className="text-2xl">🎓</span>
      <span className="text-xl font-bold text-violet-200">CampusOS</span>
    </div>
    <div className="flex items-center gap-3">
      <span className="avatar-gradient-border">
        <span className="view-attendance-avatar" aria-label="User Avatar">U</span>
      </span>
    </div>
  </header>
);

export default Header; 