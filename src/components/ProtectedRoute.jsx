// import React, { useMemo } from "react";
// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import AuthenticatedLayout from "./AuthenticatedLayout";

// /**
//  * Persistent ProtectedRoute wrapper for dashboard routes.
//  * Prevents re-mounting of AuthenticatedLayout on every render.
//  */
// const ProtectedRouteComponent = () => {
//   const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
//   const location = useLocation();

//   // 🧩 Publicly accessible paths
//   const publicPaths = ["/signin", "/signup", "/forgot-password"];
//   const isResetPage = location.pathname.startsWith("/reset-password");

//   // 🧩 Redirect unauthenticated users
//   if (!token && !publicPaths.includes(location.pathname) && !isResetPage) {
//     console.warn(
//       "[ProtectedRoute] Redirecting unauthenticated user to /signin 🚫"
//     );
//     return <Navigate to="/signin" replace />;
//   }

//   // ✅ Use memo only for layout logic, not JSX parsing
//   const layoutKey = useMemo(() => "authenticated-layout", []);

//   console.log(
//     "%c[ProtectedRoute] Layout initialized once 🧩",
//     "color:#8B5CF6; font-weight:bold;"
//   );

//   return (
//     <AuthenticatedLayout key={layoutKey}>
//       <Outlet />
//     </AuthenticatedLayout>
//   );
// };

// export default React.memo(ProtectedRouteComponent);


import React, { useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AuthenticatedLayout from "../components/AuthenticatedLayout";

/**
 * Persistent ProtectedRoute wrapper for dashboard routes.
 * Prevents re-mounting of AuthenticatedLayout on every render.
 */
const ProtectedRouteComponent = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const location = useLocation();

  const publicPaths = ["/signin", "/signup", "/forgot-password"];
  const isResetPage = location.pathname.startsWith("/reset-password");

  if (!token && !publicPaths.includes(location.pathname) && !isResetPage) {
    console.warn(
      "[ProtectedRoute] Redirecting unauthenticated user to /signin 🚫"
    );
    return <Navigate to="/signin" replace />;
  }

  // ✅ Keep AuthenticatedLayout stable across all protected routes
  const layout = useMemo(() => {
    console.log(
      "%c[ProtectedRoute] Layout initialized once 🧩",
      "color:#8B5CF6; font-weight:bold;"
    );
    return <AuthenticatedLayout />;
  }, []);

  return layout;
};

export default React.memo(ProtectedRouteComponent);
