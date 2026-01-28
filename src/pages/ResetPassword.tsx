import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff, Lock, Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";
import signInImage from "../assets/SoJo-project-closes-scaled 1.png";
import logo from "../assets/logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/reset-password/${token}`,
        { password: formData.newPassword }
      );

      setMessage(response.data.message || "Password reset successfully!");
      toast.success("Password reset successfully!");

      // Redirect after 2s so user sees success message
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (error: any) {
        console.error(error);
      const errMsg = error.response?.data?.message || "An error occurred. Please try again.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Section: Image & Brand (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-primary overflow-hidden">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-primary/80 to-primary/90 mix-blend-multiply" />
        <img
          src={signInImage}
          alt="HealthLens Dashboard"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
        />
        
        {/* Animated Blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-24 right-12 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
        
        <div className="relative z-20 flex flex-col justify-between h-full p-16 text-white">
          <Link to="/">
             <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl w-fit">
                <img src={logo} alt="Logo" className="h-8 brightness-0 invert" />
             </div>
          </Link>
          
          <div className="max-w-xl">
             <h1 className="text-5xl font-bold leading-tight mb-6 drop-shadow-sm">
               <Typewriter
                  options={{
                    strings: ["Secure Your Account.", "Reset With Ease.", "Back to Storytelling."],
                    autoStart: true,
                    loop: true,
                    delay: 75,
                    deleteSpeed: 50,
                  }}
                />
             </h1>
             <p className="text-xl text-primary-foreground/90 mb-8 leading-relaxed font-light">
               Create a strong new password to protect your journalism workspace.
             </p>
          </div>
          
          <div className="text-sm text-white/60">
             © {new Date().getFullYear()} Nigeria Health Watch. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Section: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-10 lg:hidden">
               <Link to="/" className="inline-block mb-6">
                  <img src={logo} alt="HealthLens Logo" className="h-10 dark:invert" />
               </Link>
            </div>

            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-foreground mb-3">Reset Password</h2>
              <p className="text-muted-foreground">
                Enter your new password below.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* New Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    New Password
                </label>
                <div className="relative">
                   <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                   <Input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="pl-9 pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Confirm New Password
                </label>
                <div className="relative">
                   <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                   <Input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-9 pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm border border-destructive/20 flex items-center gap-2"
                >
                  <div className="h-2 w-2 rounded-full bg-destructive" />
                  {error}
                </motion.div>
              )}

              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 text-sm border border-green-500/20 flex items-center gap-2"
                >
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  {message}
                </motion.div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                size="lg"
                className="w-full text-base font-semibold shadow-md active:scale-[0.98] transition-transform"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  <>
                    <span>Reset Password</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              
               {/* Footer Links */}
              <div className="text-center mt-4">
                <Button variant="link" asChild className="p-0 h-auto text-muted-foreground hover:text-primary">
                    <Link to="/signin">Back to Sign In</Link>
                </Button>
              </div>

            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;