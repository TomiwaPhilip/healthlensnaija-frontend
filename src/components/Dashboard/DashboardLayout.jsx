// import React, { useContext, useState, useEffect } from "react";
// import Sidebar from "./Sidebar";
// import { DashboardContext } from "../../context/DashboardContext";

// const DashboardLayout = ({ children }) => {
//   const { isNightMode } = useContext(DashboardContext);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

//   console.log("[DashboardLayout] Render 🔁", {
//     isMobile,
//     isSidebarOpen,
//     isNightMode,
//   });

//   // ✅ Handle window resize dynamically and cleanly
//   useEffect(() => {
//     console.log("[DashboardLayout] useEffect → resize handler setup");

//     const handleResize = () => {
//       const mobile = window.innerWidth < 768;
//       setIsMobile(mobile);

//       if (mobile && isSidebarOpen) {
//         setIsSidebarOpen(false);
//         console.log("[DashboardLayout] Auto-closed sidebar (mobile switch) 📱");
//       }
//     };

//     let resizeTimeout;
//     const debouncedResize = () => {
//       clearTimeout(resizeTimeout);
//       resizeTimeout = setTimeout(handleResize, 150);
//     };

//     window.addEventListener("resize", debouncedResize);
//     return () => {
//       console.log("[DashboardLayout] Cleanup resize listener 🧹");
//       window.removeEventListener("resize", debouncedResize);
//     };
//   }, [isSidebarOpen]);

//   useEffect(() => {
//     console.log("[DashboardLayout] isMobile changed →", isMobile ? "MOBILE 📱" : "DESKTOP 💻");
//   }, [isMobile]);

//   useEffect(() => {
//     console.log("[DashboardLayout] Sidebar toggled →", isSidebarOpen ? "OPEN ✅" : "CLOSED ❌");
//   }, [isSidebarOpen]);

//   useEffect(() => {
//     console.log("[DashboardLayout] Mounted ✅");
//     return () => console.log("[DashboardLayout] Unmounted 🧩");
//   }, []);

//   const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

//   return (
//     <div
//       className={`min-h-screen flex transition-colors duration-300 ${
//         isNightMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
//       }`}
//     >
//       {/* ✅ Overlay for mobile when sidebar is open */}
//       {isSidebarOpen && isMobile && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-20"
//           onClick={() => setIsSidebarOpen(false)}
//         />
//       )}

//       {/* ✅ Sidebar — responsive & stable width */}
//       <div
//         className={`${
//           isMobile
//             ? "fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 w-64"
//             : "relative w-64 shrink-0"
//         } ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} ${
//           !isMobile && "translate-x-0"
//         }`}
//       >
//         <Sidebar />
//       </div>

//       {/* ✅ Main content — stable host for any dashboard page */}
//       <div
//         className={`flex-1 min-w-0 overflow-hidden transition-all duration-300 ${
//           isMobile ? "p-3" : "p-4 md:p-6"
//         }`}
//       >
//         {/* ✅ Mobile header with toggle */}
//         {isMobile && (
//           <div className="flex items-center mb-4">
//             <button
//               onClick={toggleSidebar}
//               className={`p-2 rounded-md mr-3 ${
//                 isNightMode
//                   ? "bg-gray-700 hover:bg-gray-600"
//                   : "bg-gray-200 hover:bg-gray-300"
//               }`}
//               aria-label="Toggle menu"
//             >
//               <svg
//                 className="w-5 h-5"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M4 6h16M4 12h16M4 18h16"
//                 />
//               </svg>
//             </button>
//             <h1 className="text-xl font-semibold">Dashboard</h1>
//           </div>
//         )}

//         {/* ✅ Children passed from routes/pages */}
//         <div className="w-full">{children}</div>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;
