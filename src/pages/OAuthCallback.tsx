// src/pages/OAuthCallback.jsx
import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardContext } from "../context/DashboardContext";
import { Loader2 } from "lucide-react";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { login } = useContext(DashboardContext) as any;

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
    <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground font-medium animate-pulse">Authenticating...</p>
        </div>
    </div>
  );
};

export default OAuthCallback;
