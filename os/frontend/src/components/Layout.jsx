import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => (
  <div className="gradient-bg min-h-screen flex">
    <Sidebar />
    <div className="flex-1 flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-start px-2 sm:px-6 pb-8">
        {children}
      </main>
    </div>
  </div>
);

export default Layout; 