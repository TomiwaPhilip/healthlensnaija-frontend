// src/components/ProtectedRouteAdmin.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { DashboardContext } from "../context/DashboardContext";

export default function ProtectedRouteAdmin({ children }) {
  const { user } = useContext(DashboardContext);
  // Redirect non-admins back to regular dashboard
  return user?.role === "Admin" 
    ? children 
    : <Navigate to="/dashboard" replace />;
}
