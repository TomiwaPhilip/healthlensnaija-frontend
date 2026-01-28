import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import Typewriter from "typewriter-effect";
import signUpImage from "../assets/SoJo-project-closes-scaled 1.png";
import logo from "../assets/logo.png";
import axiosInstance from "../utils/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

  const handleOAuth = (provider: string) => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/${provider}`;
  };

  const evaluatePasswordStrength = (password: string) => {
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

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasMinLength = password.length >= 8;
    return hasUpperCase && hasLowerCase && hasNumbers && hasMinLength;
  };

  const onSubmit = async (data: any) => {
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
    } catch (error: any) {
      console.error("Error creating user:", error);
      const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case "Strong": return "bg-green-500";
      case "Good": return "bg-green-500";
      case "Medium": return "bg-yellow-500";
      case "Weak": return "bg-red-500";
      default: return "bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-background flex pt-20 lg:pt-0">
      <ToastContainer position="top-center" theme="colored" />
      
      {/* Left Section: Image & Brand (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-primary overflow-hidden">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-primary/80 to-primary/90 mix-blend-multiply" />
        <img
          src={signUpImage}
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
                    strings: ["Join the Transformation.", "Elevate Your Reporting.", "Build Better Stories."],
                    autoStart: true,
                    loop: true,
                    delay: 75,
                    deleteSpeed: 50,
                  }}
                />
             </h1>
             <p className="text-xl text-primary-foreground/90 mb-8 leading-relaxed font-light">
               Create your account today to start using AI tools designed specifically for modern health journalism.
             </p>
             
             {/* Feature List */}
             <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 space-y-4 shadow-lg">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center border border-white/20">
                     <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                   </div>
                   <span className="font-medium text-white">AI-Powered Story Generation</span>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center border border-white/20">
                     <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                   </div>
                   <span className="font-medium text-white">Instant Document Analysis</span>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center border border-white/20">
                     <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                   </div>
                   <span className="font-medium text-white">Expert Fact-Checking Tools</span>
                </div>
             </div>
          </div>
          
          <div className="text-sm text-white/60">
             © {new Date().getFullYear()} Nigeria Health Watch. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Section: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 overflow-y-auto max-h-screen bg-background">
        <div className="w-full max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {pendingMessage && (
              <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 mb-6 rounded-r-lg">
                <p className="text-yellow-600 dark:text-yellow-400 text-sm">{pendingMessage}</p>
              </div>
            )}

            <div className="text-center mb-8 lg:text-left">
              <Link to="/" className="inline-block lg:hidden mb-6">
                <img src={logo} alt="HealthLens Logo" className="h-10 dark:brightness-0 dark:invert" />
              </Link>
              <h2 className="text-3xl font-bold text-foreground mb-2">Create an Account</h2>
              <p className="text-muted-foreground">
                Let's get you set up with your personal dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">First Name <span className="text-destructive">*</span></label>
                  <div className="relative">
                     <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                     <Input
                      {...register("firstName", { required: "Required", minLength: 2 })}
                      className="pl-9"
                      placeholder="John"
                    />
                  </div>
                  {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message as string}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Last Name <span className="text-destructive">*</span></label>
                  <div className="relative">
                     <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                     <Input
                      {...register("lastName", { required: "Required", minLength: 2 })}
                      className="pl-9"
                      placeholder="Doe"
                    />
                  </div>
                  {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message as string}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Email Address <span className="text-destructive">*</span></label>
                <div className="relative">
                   <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                   <Input
                    {...register("email", { 
                      required: "Required", 
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" }
                    })}
                    className="pl-9"
                    placeholder="john@example.com"
                  />
                </div>
                {errors.email && <p className="text-xs text-destructive">{errors.email.message as string}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Phone Number <span className="text-destructive">*</span></label>
                <div className="relative">
                   <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                   <Input
                    {...register("phoneNumber", { required: "Required", pattern: { value: /^[0-9+\-() ]+$/, message: "Invalid phone" } })}
                    className="pl-9"
                    placeholder="+234 800 000 0000"
                  />
                </div>
                {errors.phoneNumber && <p className="text-xs text-destructive">{errors.phoneNumber.message as string}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Password <span className="text-destructive">*</span></label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...register("password", { required: "Required", validate: validatePassword })}
                    type={showPassword ? "text" : "password"}
                    className="pl-9 pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                
                {/* Modern Password Strength Meter */}
                <div className="mt-2 flex gap-1 h-1.5">
                   <div className={`flex-1 rounded-full bg-muted transition-colors duration-300 ${passwordStrength ? (['Weak','Medium','Good','Strong'].includes(passwordStrength) ? getPasswordStrengthColor() : 'bg-muted') : 'bg-muted'}`}></div>
                   <div className={`flex-1 rounded-full bg-muted transition-colors duration-300 ${passwordStrength ? (['Medium','Good','Strong'].includes(passwordStrength) ? getPasswordStrengthColor() : 'bg-muted') : 'bg-muted'}`}></div>
                   <div className={`flex-1 rounded-full bg-muted transition-colors duration-300 ${passwordStrength ? (['Good','Strong'].includes(passwordStrength) ? getPasswordStrengthColor() : 'bg-muted') : 'bg-muted'}`}></div>
                   <div className={`flex-1 rounded-full bg-muted transition-colors duration-300 ${passwordStrength ? (passwordStrength === 'Strong' ? getPasswordStrengthColor() : 'bg-muted') : 'bg-muted'}`}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Must include 1 uppercase, 1 lowercase, 1 number, and be 8+ chars.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Confirm Password <span className="text-destructive">*</span></label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...register("confirmPassword", { 
                      required: "Required", 
                      validate: (val: string) => val === watch('password') || "Passwords don't match"
                    })}
                    type={showConfirmPassword ? "text" : "password"}
                    className="pl-9 pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message as string}</p>}
              </div>

              <div className="flex items-start pt-2">
                <div className="flex items-center h-5">
                  <input
                    {...register("agreeToTerms", { required: "Required" })}
                    type="checkbox"
                    className="w-4 h-4 rounded border-input ring-offset-background focus:ring-primary accent-primary cursor-pointer"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label className="text-muted-foreground">
                    I agree to the{" "}
                    <Link to="/terms" className="text-primary font-medium hover:underline">Terms of Service</Link>
                    {" "}and{" "}
                    <Link to="/privacy" className="text-primary font-medium hover:underline">Privacy Policy</Link>
                  </label>
                  {errors.agreeToTerms && <p className="text-xs text-destructive mt-0.5">You must agree to continue</p>}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-background text-muted-foreground font-medium">Or</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => handleOAuth("google")}
                className="w-full gap-2 h-11 text-foreground"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
                <span>Sign up with Google</span>
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-6 pb-6 lg:pb-0">
                Already have an account?{" "}
                <Link to="/signin" className="font-bold text-primary hover:underline transition-colors">
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