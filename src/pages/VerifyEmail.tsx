import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircleIcon, XCircleIcon, ClockIcon } from "@heroicons/react/24/outline";
import { useContext } from "react";
import { DashboardContext } from "../context/DashboardContext";
 
const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const { login } = useContext(DashboardContext);
  const didVerifyRef = useRef(false);

  useEffect(() => {
    if (didVerifyRef.current) return;
    didVerifyRef.current = true;

    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/verify-email/${token}`
        );

        setMessage(response.data.message || "Your email has been verified successfully.");
        setIsSuccess(true);

        // ✅ Save tokens if provided so user is logged in automatically
        if (response.data.accessToken && response.data.refreshToken) {
          localStorage.setItem("token", response.data.accessToken);
          localStorage.setItem("refreshToken", response.data.refreshToken);
          // 🧠 NEW: hydrate the Dashboard context immediately
          try {
              const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/dashboard/me`,
                { headers: { Authorization: `Bearer ${response.data.accessToken}` } }
              );
              const fetchedUser = res.data?.user;
              if (fetchedUser) {
                login(response.data.accessToken, response.data.refreshToken, fetchedUser);
              }
            } catch (err) {
              console.error("❌ Failed to hydrate user after verify:", err);
            }

        }
      } catch (error) {
        setMessage(
          error.response?.data?.message ||
            "Email verification failed. The link may be invalid or expired."
        );
        setIsSuccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  const getIcon = () => {
    if (isLoading) {
      return <ClockIcon className="h-16 w-16 text-green-500 animate-pulse" />;
    }
    return isSuccess ? (
      <CheckCircleIcon className="h-16 w-16 text-green-500" />
    ) : (
      <XCircleIcon className="h-16 w-16 text-red-500" />
    );
  };

  const handleContinue = () => {
    if (isSuccess) {
      // ✅ If verification succeeded and tokens exist → go straight to dashboard
      const token = localStorage.getItem("token");
      if (token) {
        navigate("/generate-story", { replace: true });
      } else {
        navigate("/signin", { replace: true });
      }
    } else {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-gray-50 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-md space-y-6">
        <div className="flex flex-col items-center">
          {getIcon()}
          <h1 className="mt-4 text-2xl font-bold text-gray-800">
            {isLoading
              ? "Verifying your email..."
              : isSuccess
              ? "Verification Complete!"
              : "Verification Failed"}
          </h1>
          <p className="mt-2 text-gray-600 text-center">{message}</p>
        </div>

        {!isLoading && (
          <div className="flex justify-center">
            <button
              onClick={handleContinue}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                isSuccess
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              {isSuccess ? "Continue" : "Back to Home"}
            </button>
          </div>
        )}

        {isLoading && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-green-500 h-2.5 rounded-full animate-pulse w-3/4"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
