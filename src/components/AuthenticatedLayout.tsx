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

  return (
    <div className="flex h-screen bg-background dark:bg-background overflow-hidden">
      {/* Sidebar (fixed height) */}
      <Sidebar
        collapsed={sidebarCollapsed}
        toggleSidebar={() => {
          console.log("%c[AuthenticatedLayout] Sidebar toggled ↔️", "color:#F59E0B;");
          setSidebarCollapsed((prev) => !prev);
        }}
      />

      {/* Main content area - flexbox column with scrollable content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4">
          {/* ⛳️ Nested routes render here (Dashboard, etc.) */}
          <Outlet />

          {/* Chat Widget (only for help-center route) */}
          {showChatWidget && (
            <>
              {console.log("%c[AuthenticatedLayout] ChatbotWidget visible 💬", "color:#22C55E;")}
              <ChatbotWidget />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
