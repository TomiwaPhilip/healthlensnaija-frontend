import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve email from state or from localStorage as backup
  const emailFromState = location.state?.email || "";
  const emailFromStorage = localStorage.getItem("verifyEmail") || "";
  const [email, setEmail] = useState(emailFromState || emailFromStorage);

  useEffect(() => {
    // Always store email to localStorage for future access after page reload
    if (emailFromState) {
      localStorage.setItem("verifyEmail", emailFromState);
    }
  }, [emailFromState]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/verify-otp", { email, otp });
      setMessage(response.data.message);

      // Clean localStorage after successful verification
      localStorage.removeItem("verifyEmail");

      setTimeout(() => {
        navigate("/generate-story");
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Verification failed");
    }
    setLoading(false);
  };

  const handleResendOtp = async () => {
    try {
      await axiosInstance.post("/auth/resend-otp", { email });
      toast.success("OTP resent successfully.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleVerify} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Verify OTP</h2>

        <div className="mb-4">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label>OTP:</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>

        <button type="submit" className="bg-green-600 text-white p-2 rounded w-full" disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {message && <p className="mt-4 text-center text-sm text-red-600">{message}</p>}

        <button type="button" onClick={handleResendOtp} className="text-green-500 underline mt-2">
          Resend OTP
        </button>
      </form>
    </div>
  );
};

export default VerifyOTP;
