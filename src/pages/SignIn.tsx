import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import Typewriter from "typewriter-effect";
import signInImage from "../assets/SoJo-project-closes-scaled 1.png";
import logo from "../assets/logo.png";
import axiosInstance from "../utils/axiosInstance";
import { DashboardContext } from "../context/DashboardContext";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { login } = useContext(DashboardContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const parsed = JSON.parse(atob(token.split(".")[1]));
      const isExpired = parsed.exp * 1000 < Date.now();
      if (!isExpired) {
        navigate("/generate-story", { replace: true });
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOAuth = (provider) => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/${provider}`;
  };

  const handleSubmit = async (e) => {
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
    } catch (err) {
      const errorMessage = err.response?.data?.message || "An error occurred. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Section: Image & Brand (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-[#3AB54A] overflow-hidden">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#3AB54A]/80 to-[#2d963c]/90" />
        <img
          src={signInImage}
          alt="HealthLens Dashboard"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
        />
        
        {/* Animated Blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-24 right-12 w-80 h-80 bg-[#8CC43D]/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        
        <div className="relative z-20 flex flex-col justify-between h-full p-16 text-white">
          <Link to="/">
             <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl w-fit">
                <img src={logo} alt="Logo" className="h-8 brightness-0 invert" />
             </div>
          </Link>
          
          <div className="max-w-xl">
             <h1 className="text-5xl font-bold leading-tight mb-6">
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
             <p className="text-xl text-green-50 mb-8 leading-relaxed">
               Access your personalized dashboard to generate stories, analyze documents, and collaborate with AI.
             </p>
             
             {/* Testimonial Card */}
             <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                <div className="flex gap-1 mb-3">
                   {[1,2,3,4,5].map(i => (
                     <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                   ))}
                </div>
                <p className="italic text-green-50 mb-4">"HealthLens has completely transformed how I research and write health stories. The AI tools are incredibly accurate."</p>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">JD</div>
                   <div>
                      <div className="font-semibold">Jane Doe</div>
                      <div className="text-sm text-green-100">Senior Health Correspondent</div>
                   </div>
                </div>
             </div>
          </div>
          
          <div className="text-sm text-green-100/60">
             © 2026 Nigeria Health Watch. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Section: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-10 lg:hidden">
               <Link to="/" className="inline-block mb-6">
                  <img src={logo} alt="HealthLens Logo" className="h-10" />
               </Link>
            </div>

            <div className="mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Sign in to your account</h2>
              <p className="text-gray-500">
                Welcome back! Please enter your details.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">Email</label>
                <div className="relative group">
                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#3AB54A] transition-colors">
                      <Mail className="h-5 w-5" />
                   </div>
                   <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3AB54A]/20 focus:border-[#3AB54A] transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">Password</label>
                <div className="relative group">
                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#3AB54A] transition-colors">
                      <Lock className="h-5 w-5" />
                   </div>
                   <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3AB54A]/20 focus:border-[#3AB54A] transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password & Error */}
              <div className="flex items-center justify-end">
                <Link 
                  to="/forgot-password" 
                  className="text-sm font-medium text-[#3AB54A] hover:text-[#2d963c] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100 flex items-center gap-2"
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center py-3.5 px-4 bg-[#3AB54A] hover:bg-[#2d963c] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:transform-none disabled:shadow-none space-x-2"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {/* Social Login */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOAuth("google")}
                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border border-gray-200 rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium group"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span>Sign in with Google</span>
              </button>

              {/* Sign Up Link */}
              <p className="text-center text-sm text-gray-600 mt-8">
                Don't have an account?{" "}
                <Link to="/signup" className="font-bold text-[#3AB54A] hover:text-[#2d963c] transition-colors">
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