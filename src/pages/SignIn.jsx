import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import Typewriter from "typewriter-effect";
import signInImage from "../assets/SoJo-project-closes-scaled 1.png";
import logo from "../assets/logo.png";
import axiosInstance from "../utils/axiosInstance";
import { motion } from "framer-motion";
import { useContext } from "react";
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
  
    if (!token) return; // ✅ Only redirect if token exists
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
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleOAuth = (provider) => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/${provider}`;

  };
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pendingEmail = params.get("email");
    if (window.location.pathname.includes("pending-verification") && pendingEmail) {
      setError(`We sent a verification link to ${pendingEmail}. Please check your email to continue.`);
    }
  }, []);
  


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
  
      // if (errorMessage.includes("verify your account via OTP")) {
      //   localStorage.setItem("verifyEmail", formData.email);
      //   navigate("/verify-otp", { state: { email: formData.email } });
      // } else {
      //   setError(errorMessage);
      // }

      setError(errorMessage);
      
    } finally {
      // ✅ Always stop loading no matter what
      setLoading(false);
    }
  };
  
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl bg-white rounded-xl shadow-lg overflow-hidden flex flex-col lg:flex-row"
      >
        {/* Left Section with Image and Overlay */}
        <div className="lg:w-1/2 relative h-64 lg:h-auto hidden lg:block">
          <img
            src={signInImage}
            alt="Sign In"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/40 flex items-center justify-center p-8">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-white text-4xl font-bold mb-4">
                <Typewriter
                  options={{
                    strings: ["Welcome Back!", "Secure Your Account", "Join the Journey!"],
                    autoStart: true,
                    loop: true,
                    delay: 75,
                    deleteSpeed: 50,
                  }}
                />
              </h2>
              <p className="text-gray-200 text-lg">Sign in to access your personalized dashboard</p>
            </motion.div>
          </div>
        </div>

        {/* Right Section with Form */}
        <div className="lg:w-1/2 p-8 sm:p-12 flex items-center justify-center">
          <div className="w-full max-w-md">
            <motion.div 
              className="mb-8 flex flex-col items-center justify-center text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link to="/">
                <motion.img 
                  src={logo} 
                  alt="Logo" 
                  className="h-18 mb-4 cursor-pointer hover:opacity-90 transition-opacity"
                  whileHover={{ scale: 1.05 }}
                />
              </Link>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign In to Your Account</h2>
              <p className="text-gray-600">Welcome back! Please enter your details.</p>
            </motion.div>

            <form onSubmit={handleSubmit}>
              <motion.div 
                className="mb-5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  required
                />
              </motion.div>

              <motion.div 
                className="mb-5 relative"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </motion.div>

              {error && (
                <motion.p 
                  className="text-red-500 text-sm mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {error}
                </motion.p>
              )}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  type="submit"
                  className={`w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : "Sign In"}
                </button>
              </motion.div>
            </form>

            <motion.div 
              className="mt-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <button
                onClick={() => navigate("/forgot-password")}
                className="w-full text-center text-sm text-gray-600 hover:text-green-600 transition-colors"
              >
                Forgot Password?
              </button>
            </motion.div>

            <motion.div 
              className="text-center mt-6 text-gray-600"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              Don't have an account?{" "}
              <Link to="/signup" className="text-green-600 hover:text-green-700 font-medium transition-colors">
                Sign Up
              </Link>
            </motion.div>

            <motion.div 
              className="flex items-center justify-center mt-8 mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="border-t border-gray-200 flex-grow"></div>
              <span className="mx-4 text-gray-400 text-sm">OR</span>
              <div className="border-t border-gray-200 flex-grow"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <button
                onClick={() => handleOAuth("google")}
                className="w-full flex items-center justify-center border border-gray-200 rounded-xl py-3 text-gray-700 hover:bg-gray-50 transition-colors"
              >
            <FaGoogle className="h-5 w-5 mr-3 text-green-600" />

                <span>Sign In with Google</span>
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;