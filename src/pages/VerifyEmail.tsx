import React, { useEffect, useState, useRef, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { DashboardContext } from "../context/DashboardContext";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const { login } = useContext(DashboardContext) as any;
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
      } catch (error: any) {
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
  }, [token, login]);

  const handleContinue = () => {
    if (isSuccess) {
      const token = localStorage.getItem("token");
      if (token) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/signin", { replace: true });
      }
    } else {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <CardContent className="flex flex-col items-center gap-6 text-center pt-6">
          {isLoading ? (
            <div className="rounded-full bg-primary/10 p-4">
               <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : isSuccess ? (
            <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/20">
               <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-500" />
            </div>
          ) : (
            <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/20">
               <XCircle className="h-12 w-12 text-red-600 dark:text-red-500" />
            </div>
          )}

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {isLoading ? "Verifying..." : isSuccess ? "Verified!" : "Verification Failed"}
            </h1>
            <p className="text-muted-foreground max-w-xs mx-auto">
                {message}
            </p>
          </div>

          {!isLoading && (
            <Button onClick={handleContinue} className="w-full" size="lg">
              {isSuccess ? "Continue to Dashboard" : "Back to Home"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
