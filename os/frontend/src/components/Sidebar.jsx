import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { to: '/attendance', icon: '📍', label: 'Attendance' },
  { to: '/attendance-list', icon: '📋', label: 'Attendance List' },
  { to: '/records', icon: '📄', label: 'Records' },
  { to: '/notes', icon: '📝', label: 'Notes' },
];

const Sidebar = () => (
  <aside className="glass-card sidebar flex flex-col gap-2 py-6 px-2 min-h-screen w-[70px] sm:w-[200px] items-center sm:items-start">
    <div className="mb-8 flex items-center gap-2">
      <span className="text-2xl">🎓</span>
      <span className="hidden sm:inline text-lg font-bold text-violet-200">CampusOS</span>
    </div>
    <nav className="flex flex-col gap-2 w-full">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg transition-all font-semibold text-white hover:bg-violet-600/30 hover:text-violet-200 ${
              isActive ? 'bg-violet-600/60 text-violet-100 shadow' : ''
            }`
          }
        >
          <span className="text-xl">{item.icon}</span>
          <span className="hidden sm:inline">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default Sidebar; 