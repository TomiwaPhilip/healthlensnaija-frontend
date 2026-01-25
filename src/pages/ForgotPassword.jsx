import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";
import "react-toastify/dist/ReactToastify.css";
import signInImage from "../assets/SoJo-project-closes-scaled 1.png";
import logo from "../assets/logo.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
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
    } catch (err) {
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-6xl bg-white rounded-xl shadow-lg overflow-hidden flex flex-col lg:flex-row"
        >
          {/* Left Section with Image and Overlay */}
          <div className="lg:w-1/2 relative h-64 lg:h-auto">
            <img
              src={signInImage}
              alt="Forgot Password"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/40 flex items-center justify-center p-8">
              <motion.div 
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-white text-3xl lg:text-4xl font-bold mb-4">
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
                <p className="text-gray-200 text-sm lg:text-lg">
                  Enter your email to receive a password reset link
                </p>
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
                    className="h-16 lg:h-18 mb-4 cursor-pointer hover:opacity-90 transition-opacity"
                    whileHover={{ scale: 1.05 }}
                  />
                </Link>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                  Forgot Password
                </h2>
                <p className="text-gray-600 text-sm lg:text-base">
                  Enter your registered email to receive a reset link.
                </p>
              </motion.div>

              <form onSubmit={handleSubmit}>
                <motion.div 
                  className="mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors ${
                      loading ? 'opacity-80 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : "Send Reset Link"}
                  </button>
                </motion.div>
              </form>

              <motion.div 
                className="mt-6 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  onClick={() => navigate("/signin")}
                  className="w-full text-center text-sm text-gray-600 hover:text-green-600 transition-colors mb-4"
                >
                  Back to Sign In
                </button>
                
                <p className="text-gray-600 text-sm lg:text-base">
                  Don't have an account?{" "}
                  <Link 
                    to="/signup" 
                    className="text-green-600 hover:text-green-700 font-medium transition-colors"
                  >
                    Sign Up
                  </Link>
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </>
  );
};

export default ForgotPassword;