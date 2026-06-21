import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';

const OwnerLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex flex-1 min-w-0 flex-col">
        <Navbar />

        <main className="flex-1 min-w-0 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OwnerLayout;