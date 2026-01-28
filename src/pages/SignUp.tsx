import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight } from "lucide-react";
import Typewriter from "typewriter-effect";
import signUpImage from "../assets/SoJo-project-closes-scaled 1.png";
import logo from "../assets/logo.png";
import axiosInstance from "../utils/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    reset
  } = useForm({ mode: "onChange" });
  
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingMessage, setPendingMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pendingEmail = params.get("email");
    if (window.location.pathname.includes("pending-verification") && pendingEmail) {
      setPendingMessage(`We sent a verification link to ${pendingEmail}. Please check your inbox.`);
    }
  }, []);

  const handleOAuth = (provider) => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/${provider}`;
  };

  const evaluatePasswordStrength = (password) => {
    if (!password) return "";
    let strength = 0;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    if (password.length >= 8) strength++;

    if (strength >= 4) return "Strong";
    if (strength >= 3) return "Good";
    if (strength >= 2) return "Medium";
    return "Weak";
  };

  const password = watch("password");
  useEffect(() => {
    setPasswordStrength(evaluatePasswordStrength(password));
  }, [password]);

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasMinLength = password.length >= 8;
    return hasUpperCase && hasLowerCase && hasNumbers && hasMinLength;
  };

  const onSubmit = async (data) => {
    if (!data.agreeToTerms) {
      toast.error("You must accept the terms and conditions");
      return;
    }
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (!validatePassword(data.password)) {
      toast.error("Password does not meet requirements.");
      return;
    }
  
    setIsSubmitting(true);
    try {
      await axiosInstance.post("/auth/signup", data);
      toast.success("Account created! Check your email to verify.", { autoClose: 5000 });
      reset();
      setTimeout(() => navigate("/signin?pending-verification=1&email=" + encodeURIComponent(data.email)), 3000);
    } catch (error) {
      console.error("Error creating user:", error);
      const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case "Strong": return "bg-[#3AB54A]";
      case "Good": return "bg-[#3AB54A]";
      case "Medium": return "bg-yellow-500";
      case "Weak": return "bg-red-500";
      default: return "bg-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <ToastContainer position="top-center" theme="colored" />
      
      {/* Left Section: Image & Brand (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-[#3AB54A] overflow-hidden">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#3AB54A]/80 to-[#2d963c]/90" />
        <img
          src={signUpImage}
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
                    strings: ["Join the Transformation.", "Elevate Your Reporting.", "Build Better Stories."],
                    autoStart: true,
                    loop: true,
                    delay: 75,
                    deleteSpeed: 50,
                  }}
                />
             </h1>
             <p className="text-xl text-green-50 mb-8 leading-relaxed">
               Create your account today to start using AI tools designed specifically for modern health journalism.
             </p>
             
             {/* Feature List */}
             <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-[#3AB54A] flex items-center justify-center">
                     <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                   </div>
                   <span className="font-medium">AI-Powered Story Generation</span>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-[#3AB54A] flex items-center justify-center">
                     <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                   </div>
                   <span className="font-medium">Instant Document Analysis</span>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-[#3AB54A] flex items-center justify-center">
                     <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                   </div>
                   <span className="font-medium">Expert Fact-Checking Tools</span>
                </div>
             </div>
          </div>
          
          <div className="text-sm text-green-100/60">
             © 2026 Nigeria Health Watch. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Section: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 overflow-y-auto max-h-screen">
        <div className="w-full max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {pendingMessage && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
                <p className="text-yellow-800 text-sm">{pendingMessage}</p>
              </div>
            )}

            <div className="text-center mb-8 lg:text-left">
              <Link to="/" className="inline-block lg:hidden mb-6">
                <img src={logo} alt="HealthLens Logo" className="h-10" />
              </Link>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create an Account</h2>
              <p className="text-gray-500">
                Let's get you set up with your personal dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">First Name <span className="text-red-500">*</span></label>
                  <div className="relative group">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#3AB54A] transition-colors">
                        <User className="h-5 w-5" />
                     </div>
                     <input
                      {...register("firstName", { required: "Required", minLength: 2 })}
                      className={`block w-full pl-10 pr-3 py-3 bg-gray-50 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3AB54A]/20 transition-all ${errors.firstName ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#3AB54A]'}`}
                      placeholder="John"
                    />
                  </div>
                  {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Last Name <span className="text-red-500">*</span></label>
                  <div className="relative group">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#3AB54A] transition-colors">
                        <User className="h-5 w-5" />
                     </div>
                     <input
                      {...register("lastName", { required: "Required", minLength: 2 })}
                      className={`block w-full pl-10 pr-3 py-3 bg-gray-50 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3AB54A]/20 transition-all ${errors.lastName ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#3AB54A]'}`}
                      placeholder="Doe"
                    />
                  </div>
                  {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Email Address <span className="text-red-500">*</span></label>
                <div className="relative group">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#3AB54A] transition-colors">
                      <Mail className="h-5 w-5" />
                   </div>
                   <input
                    {...register("email", { 
                      required: "Required", 
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" }
                    })}
                    className={`block w-full pl-10 pr-3 py-3 bg-gray-50 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3AB54A]/20 transition-all ${errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#3AB54A]'}`}
                    placeholder="john@example.com"
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Phone Number <span className="text-red-500">*</span></label>
                <div className="relative group">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#3AB54A] transition-colors">
                      <Phone className="h-5 w-5" />
                   </div>
                   <input
                    {...register("phoneNumber", { required: "Required", pattern: { value: /^[0-9+\-() ]+$/, message: "Invalid phone" } })}
                    className={`block w-full pl-10 pr-3 py-3 bg-gray-50 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3AB54A]/20 transition-all ${errors.phoneNumber ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#3AB54A]'}`}
                    placeholder="+234 800 000 0000"
                  />
                </div>
                {errors.phoneNumber && <p className="text-xs text-red-500">{errors.phoneNumber.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Password <span className="text-red-500">*</span></label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#3AB54A] transition-colors">
                      <Lock className="h-5 w-5" />
                  </div>
                  <input
                    {...register("password", { required: "Required", validate: validatePassword })}
                    type={showPassword ? "text" : "password"}
                    className={`block w-full pl-10 pr-10 py-3 bg-gray-50 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3AB54A]/20 transition-all ${errors.password ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#3AB54A]'}`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                
                {/* Modern Password Strength Meter */}
                <div className="mt-2 flex gap-1 h-1.5">
                   <div className={`flex-1 rounded-full bg-gray-200 ${passwordStrength ? (['Weak','Medium','Good','Strong'].includes(passwordStrength) ? getPasswordStrengthColor() : '') : ''}`}></div>
                   <div className={`flex-1 rounded-full bg-gray-200 ${passwordStrength ? (['Medium','Good','Strong'].includes(passwordStrength) ? getPasswordStrengthColor() : '') : ''}`}></div>
                   <div className={`flex-1 rounded-full bg-gray-200 ${passwordStrength ? (['Good','Strong'].includes(passwordStrength) ? getPasswordStrengthColor() : '') : ''}`}></div>
                   <div className={`flex-1 rounded-full bg-gray-200 ${passwordStrength ? (passwordStrength === 'Strong' ? getPasswordStrengthColor() : '') : ''}`}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Must include 1 uppercase, 1 lowercase, 1 number, and be 8+ chars.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Confirm Password <span className="text-red-500">*</span></label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#3AB54A] transition-colors">
                      <Lock className="h-5 w-5" />
                  </div>
                  <input
                    {...register("confirmPassword", { 
                      required: "Required", 
                      validate: val => val === watch('password') || "Passwords don't match"
                    })}
                    type={showConfirmPassword ? "text" : "password"}
                    className={`block w-full pl-10 pr-10 py-3 bg-gray-50 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3AB54A]/20 transition-all ${errors.confirmPassword ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#3AB54A]'}`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
              </div>

              <div className="flex items-start pt-2">
                <div className="flex items-center h-5">
                  <input
                    {...register("agreeToTerms", { required: "Required" })}
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-[#3AB54A] focus:ring-[#3AB54A] cursor-pointer"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label className="text-gray-600">
                    I agree to the{" "}
                    <Link to="/terms" className="text-[#3AB54A] font-medium hover:underline">Terms of Service</Link>
                    {" "}and{" "}
                    <Link to="/privacy" className="text-[#3AB54A] font-medium hover:underline">Privacy Policy</Link>
                  </label>
                  {errors.agreeToTerms && <p className="text-xs text-red-500 mt-0.5">You must agree to continue</p>}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="w-full flex items-center justify-center py-3.5 px-4 bg-[#3AB54A] hover:bg-[#2d963c] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:transform-none disabled:shadow-none space-x-2"
              >
                {isSubmitting ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500 font-medium">Or</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOAuth("google")}
                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border border-gray-200 rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium group"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span>Sign up with Google</span>
              </button>

              <p className="text-center text-sm text-gray-600 mt-6 pb-6 lg:pb-0">
                Already have an account?{" "}
                <Link to="/signin" className="font-bold text-[#3AB54A] hover:text-[#2d963c] transition-colors">
                  Sign In
                </Link>
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;