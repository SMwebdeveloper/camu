import React from 'react'
import { Outlet } from 'react-router'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
const MainLayout = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar chapda */}
      <Sidebar />

      {/* Asosiy qism */}
      <div className="flex flex-col flex-1">
        {/* Header tepada */}
        <Header />

        {/* Content markazda */}
        <main className="flex-1 flex items-center justify-center bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout