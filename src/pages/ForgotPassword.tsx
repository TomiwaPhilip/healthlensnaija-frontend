import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";
import "react-toastify/dist/ReactToastify.css";
import signInImage from "../assets/SoJo-project-closes-scaled 1.png";
import logo from "../assets/logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
        { email }
      );

      toast.success("✅ Check your email for the password reset link.", {
        position: "top-center",
        autoClose: 2500,
        theme: "colored",
      });
    } catch (err: any) {
      const msg =
        err.response?.data?.message || "This email is not registered.";
      toast.error(msg, {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-6xl bg-card rounded-xl shadow-lg overflow-hidden flex flex-col lg:flex-row border"
        >
          {/* Left Section with Image and Overlay */}
          <div className="lg:w-1/2 relative h-64 lg:h-auto bg-muted">
            <img
              src={signInImage}
              alt="Forgot Password"
              className="object-cover w-full h-full"
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-primary/90 mix-blend-multiply" />
            
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <motion.div 
                className="text-center text-primary-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-3xl lg:text-4xl font-bold mb-4 drop-shadow-md">
                  <Typewriter
                    options={{
                      strings: ["Reset Your Password", "Secure Your Account", "We've Got You Covered!"],
                      autoStart: true,
                      loop: true,
                      delay: 75,
                      deleteSpeed: 50,
                    }}
                  />
                </h2>
                <p className="text-primary-foreground/80 text-sm lg:text-lg">
                  Enter your email to receive a password reset link
                </p>
              </motion.div>
            </div>
          </div>

          {/* Right Section with Form */}
          <div className="lg:w-1/2 p-8 sm:p-12 flex items-center justify-center bg-card">
            <div className="w-full max-w-md space-y-8">
              <motion.div 
                className="flex flex-col items-center justify-center text-center space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Link to="/">
                  <img 
                    src={logo} 
                    alt="Logo" 
                    className="h-12 mb-2 dark:invert"
                  />
                </Link>
                <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                  Forgot Password
                </h2>
                <p className="text-muted-foreground text-sm">
                  Enter your registered email to receive a reset link.
                </p>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email Address <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full"
                    size="lg"
                  >
                    {loading ? (
                       <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                       </>
                    ) : "Send Reset Link"}
                  </Button>
              </form>

              {/* Footer Links */}
              <div className="text-center space-y-4">
                <Button variant="link" asChild className="p-0 h-auto text-muted-foreground hover:text-primary">
                    <Link to="/signin">Back to Sign In</Link>
                </Button>
                
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link 
                    to="/signup" 
                    className="text-primary hover:underline font-medium"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <ToastContainer />
    </>
  );
};

export default ForgotPassword;