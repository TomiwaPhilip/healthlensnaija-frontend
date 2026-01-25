// Dashboard.jsx
import React, { useState, useEffect, useContext } from "react";
import { DashboardContext } from "../../context/DashboardContext";
import Overview from "../../components/Dashboard/Overview";
import RecentActivity from "../../components/Dashboard/RecentActivity";

const Dashboard = () => {
  const { isNightMode } = useContext(DashboardContext);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    console.log(
      "%c[Dashboard] Mounted once ✅",
      "color:#16A34A; font-weight:bold;"
    );
    return () => console.warn("%c[Dashboard] Unmounted 🧹", "color:#EF4444;");
  }, []);

  
  // Log render cycles
  useEffect(() => {
    console.log("%c[Dashboard] Rendered 🔁", "color:#3B82F6; font-weight:bold;");
  });

  // Log active tab changes
  useEffect(() => {
    console.log("%c[Dashboard] Active tab →", "color:#9333EA;", activeTab);
  }, [activeTab]);

  // Log mount/unmount
  useEffect(() => {
    console.log("%c[Dashboard] Mounted ✅", "color:#16A34A;");
    return () => console.log("%c[Dashboard] Unmounted 🧹", "color:#DC2626;");
  }, []);

  // Log layout after mount to see if mobile dimensions change
  useEffect(() => {
    const logLayout = () => {
      console.log("%c[Dashboard Layout]", "color:#0EA5E9;", {
        width: window.innerWidth,
        height: window.innerHeight,
        activeTab,
      });
    };
    logLayout();
    window.addEventListener("resize", logLayout);
    return () => window.removeEventListener("resize", logLayout);
  }, [activeTab]);

  // Simplified tabs - only Overview remains
  const tabs = [
    { key: "overview", label: "Overview" },
  ];

  return (
    <div className="p-2 sm:p-3 md:p-4 lg:p-6 min-h-screen overflow-x-hidden">
      {/* Tab Navigation - Only show if there are multiple tabs */}
      {tabs.length > 1 ? (
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 sm:px-4 py-2 text-sm sm:text-base font-medium rounded-t-md transition-all duration-200 
                ${
                  activeTab === tab.key
                    ? isNightMode
                      ? "bg-gray-800 text-white border-b-2 border-green-500"
                      : "bg-white text-green-700 border-b-2 border-green-600"
                    : isNightMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      ) : (
        // Single tab - just show the title as a header
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm sm:text-base">
            Welcome to your dashboard
          </p>
        </div>
      )}

      <div className="mt-2 sm:mt-4">
        {activeTab === "overview" && (
          <div className="flex flex-col gap-3 sm:gap-4 md:gap-6">
            <Overview />
            <RecentActivity />
          </div>
        )}
        {/* Removed Uploads and Custom Dashboard tabs */}
      </div>
    </div>
  );
};

export default Dashboard;