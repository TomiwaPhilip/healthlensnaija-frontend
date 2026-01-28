import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import Typewriter from "typewriter-effect";
import signInImage from "../assets/SoJo-project-closes-scaled 1.png";
import logo from "../assets/logo.png";
import axiosInstance from "../utils/axiosInstance";
import { DashboardContext } from "../context/DashboardContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Using fallback matching style if component missing, but attempting generic import
// Note: If Label component is missing, I will use standard label element with classes. 
// However, considering I am replacing file content, I'll stick to standard html label with shadcn classes to be safe as I didn't verify Label.tsx existence
// wait, I checked list_dir earlier, Label.tsx was NOT in the list. So I will use <label> tag.

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { login } = useContext(DashboardContext) as any;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const parsed = JSON.parse(atob(token.split(".")[1]));
      const isExpired = parsed.exp * 1000 < Date.now();
      if (!isExpired) {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      console.warn("Invalid token format, staying on signin.");
    }
  }, [navigate]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pendingEmail = params.get("email");
    if (window.location.pathname.includes("pending-verification") && pendingEmail) {
      setError(`We sent a verification link to ${pendingEmail}. Please check your email to continue.`);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOAuth = (provider: string) => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/${provider}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    try {
      const response = await axiosInstance.post("/auth/signin", {
        email: formData.email.trim(),
        password: formData.password.trim(),
      });
  
      login(response.data.accessToken, response.data.refreshToken);
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "An error occurred. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex pt-20 lg:pt-0">
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
                    strings: ["Welcome Back!", "Empowering Health Journalism.", "Data-Driven Stories."],
                    autoStart: true,
                    loop: true,
                    delay: 75,
                    deleteSpeed: 50,
                  }}
                />
             </h1>
             <p className="text-xl text-primary-foreground/90 mb-8 leading-relaxed font-light">
               Access your personalized dashboard to generate stories, analyze documents, and collaborate with AI.
             </p>
             
             {/* Testimonial Card */}
             <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-lg">
                <div className="flex gap-1 mb-3">
                   {[1,2,3,4,5].map(i => (
                     <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                   ))}
                </div>
                <p className="italic text-white/90 mb-4">"HealthLens has completely transformed how I research and write health stories. The AI tools are incredibly accurate."</p>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">JD</div>
                   <div>
                      <div className="font-semibold text-white">Jane Doe</div>
                      <div className="text-sm text-white/70">Senior Health Correspondent</div>
                   </div>
                </div>
             </div>
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
                  <img src={logo} alt="HealthLens Logo" className="h-10 dark:brightness-0 dark:invert" />
               </Link>
            </div>

            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-foreground mb-3">Sign in to your account</h2>
              <p className="text-muted-foreground">
                Welcome back! Please enter your details to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Email
                </label>
                <div className="relative">
                   <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                   <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-9"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Password
                </label>
                <div className="relative">
                   <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                   <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
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

              {/* Forgot Password & Error */}
              <div className="flex items-center justify-end">
                <Link 
                  to="/forgot-password" 
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </Link>
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
                    Signing In...
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              {/* Social Login */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-background text-muted-foreground font-medium">Or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => handleOAuth("google")}
                className="w-full gap-2 h-11 text-foreground"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
                <span>Sign in with Google</span>
              </Button>

              {/* Sign Up Link */}
              <p className="text-center text-sm text-muted-foreground mt-8">
                Don't have an account?{" "}
                <Link to="/signup" className="font-semibold text-primary hover:underline transition-colors">
                  Create an account
                </Link>
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;