"use client";
import Sidebar from "@/app/(customerDashboard)/user-dashboard/components/sharedDashboardComp/Sidebar";
import { useState } from "react";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        role="admin"
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content - with left margin for desktop sidebar */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
