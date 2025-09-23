import { useState } from "react";
import { Outlet } from "react-router";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true); // desktop uchun
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false); // mobile uchun

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Asosiy qism */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <Header
          onToggleSidebar={() => {
            setSidebarOpen(!sidebarOpen);
            console.log(sidebarOpen);
          }}
          onToggleMobile={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        {/* Content */}
        <main className="flex-1 bg-gray-50 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
