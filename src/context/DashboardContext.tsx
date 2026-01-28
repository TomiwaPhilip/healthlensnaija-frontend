// src/context/DashboardContext.jsx
import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useTheme } from "next-themes";

export const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(
    localStorage.getItem("hydratedUser")
      ? JSON.parse(localStorage.getItem("hydratedUser"))
      : null
  );
  // `next-themes` manages the actual theme; we'll derive a boolean from it
  const { theme, setTheme, resolvedTheme } = useTheme();
  const isNightMode = resolvedTheme === "dark";

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

  const toggleNightMode = () => {
    // Toggle through next-themes so the ThemeProvider is authoritative
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

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
