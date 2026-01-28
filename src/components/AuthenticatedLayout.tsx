import React, { useState, useMemo, useEffect } from "react";
import Sidebar from "./Dashboard/Sidebar";
import DashboardHeader from "./Dashboard/Header";
import ChatbotWidget from "./ChatbotWidget";
import { Outlet, useLocation } from "react-router-dom";

const AuthenticatedLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const showChatWidget = location.pathname === "/help-center";

  // 🧠 Log lifecycle
  useEffect(() => {
    console.log("%c[AuthenticatedLayout] Mounted ✅", "color:#16A34A; font-weight:bold;");
    return () =>
      console.log("%c[AuthenticatedLayout] Unmounted 🧹", "color:#DC2626; font-weight:bold;");
  }, []);

  // 🧩 Log path changes for clarity
  useEffect(() => {
    console.log("%c[AuthenticatedLayout] Path changed →", "color:#3B82F6; font-weight:bold;", location.pathname);
  }, [location.pathname]);

  // ✅ Memoize Outlet content to prevent unnecessary re-mounts
  const memoizedContent = useMemo(() => {
    console.log("%c[AuthenticatedLayout] Outlet memoized 🧩", "color:#8B5CF6;");
    return (
      <main className="p-4">
        {/* ⛳️ Nested routes render here (Dashboard, etc.) */}
        <Outlet />
      </main>
    );
  }, []); // Only create once — persists across route transitions

  return (
    <div className="flex bg-white dark:bg-gray-900 min-h-screen overflow-x-hidden">
      {/* Sidebar (collapsible) */}
      <Sidebar
        collapsed={sidebarCollapsed}
        toggleSidebar={() => {
          console.log("%c[AuthenticatedLayout] Sidebar toggled ↔️", "color:#F59E0B;");
          setSidebarCollapsed((prev) => !prev);
        }}
      />

      <div
        className={`flex-1 main-content transition-all duration-300 ${
          sidebarCollapsed ? "collapsed-sidebar" : ""
        }`}
      >
        {/* Top Header */}
        <DashboardHeader />

        {/* Persistent Outlet (memoized) */}
        {memoizedContent}

        {/* Chat Widget (only for help-center route) */}
        {showChatWidget && (
          <>
            {console.log("%c[AuthenticatedLayout] ChatbotWidget visible 💬", "color:#22C55E;")}
            <ChatbotWidget />
          </>
        )}
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
