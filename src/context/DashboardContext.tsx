// src/context/DashboardContext.jsx
import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

export const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(
    localStorage.getItem("hydratedUser")
      ? JSON.parse(localStorage.getItem("hydratedUser"))
      : null
  );
  const [isNightMode, setIsNightMode] = useState(false);

  // 🔄 Fetch user if no hydrated user but we have a token
  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    // only fetch if we don’t already have user data
    if (user) return;

    axiosInstance
      .get("/dashboard/me")
      .then((res) => setUser(res.data.user))
      .catch((err) => {
        console.error("❌ Failed to load user:", err.response?.data || err.message);
        setUser(null);
      });
  }, [token]);

  // ✅ login now supports optional hydrated user
  const login = (accessToken, refreshToken, hydratedUser = null) => {
    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    if (hydratedUser) {
      setUser(hydratedUser);
      localStorage.setItem("hydratedUser", JSON.stringify(hydratedUser));
    }
    setToken(accessToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("hydratedUser");
    setToken(null);
    setUser(null);
  };

  const toggleNightMode = () => setIsNightMode((prev) => !prev);

  useEffect(() => {
    if (isNightMode) {
      document.body.classList.add("bg-gray-900", "text-white");
    } else {
      document.body.classList.remove("bg-gray-900", "text-white");
    }
  }, [isNightMode]);

  return (
    <DashboardContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        isNightMode,
        toggleNightMode,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
