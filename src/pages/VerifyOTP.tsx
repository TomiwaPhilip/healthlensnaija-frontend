import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

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

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/verify-otp", { email, otp });
      setMessage(response.data.message);

      // Clean localStorage after successful verification
      localStorage.removeItem("verifyEmail");
      toast.success("Verification successful!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Verification failed");
      toast.error(err.response?.data?.message || "Verification failed");
    }
    setLoading(false);
  };

  const handleResendOtp = async () => {
    try {
      await axiosInstance.post("/auth/resend-otp", { email });
      toast.success("OTP resent successfully.");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Verify OTP</CardTitle>
          <CardDescription className="text-center">
            Enter the One-Time Password sent to your email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="otp" className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                OTP Code
              </label>
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                required
                className="tracking-widest"
              />
            </div>

            {message && (
              <p className={`text-sm text-center ${message.includes("success") ? "text-green-600" : "text-destructive"}`}>
                {message}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
           <div className="text-center text-sm text-muted-foreground">
                Didn't receive the code?
            </div>
          <Button variant="link" onClick={handleResendOtp} className="h-auto p-0 text-primary">
            Resend OTP
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyOTP;
