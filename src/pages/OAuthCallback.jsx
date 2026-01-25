// src/pages/OAuthCallback.jsx
import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardContext } from "../context/DashboardContext";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { login } = useContext(DashboardContext);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const refreshToken = params.get("refreshToken");
    const userParam = params.get("user");

    if (token && userParam) {
      try {
        const hydratedUser = JSON.parse(decodeURIComponent(userParam));
        // ✅ Hydrate both token + user directly
        login(token, refreshToken, hydratedUser);
        navigate("/dashboard", { replace: true });
      } catch (err) {
        console.error("Error parsing user info:", err);
        navigate("/signin");
      }
    } else {
      navigate("/signin");
    }
  }, [navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div role="status" className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-r-transparent">
        <span className="sr-only">Processing login...</span>
      </div>
    </div>
  );
};

export default OAuthCallback;
