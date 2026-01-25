import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaGoogle, FaFacebook, FaTwitter, FaEye, FaEyeSlash } from "react-icons/fa";
import signUpImage from "../assets/SoJo-project-closes-scaled 1.png";
import logo from "../assets/logo.png";
import axiosInstance from "../utils/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";

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
  const navigate = useNavigate();

  const handleOAuth = (provider) => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/${provider}`;

  };

  const evaluatePasswordStrength = (password) => {
    if (!password) return "";
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 8;

    let strength = 0;
    if (hasUpperCase) strength++;
    if (hasLowerCase) strength++;
    if (hasNumbers) strength++;
    if (hasSpecialChar) strength++;
    if (hasMinLength) strength++;

    if (strength >= 4) return "Strong";
    if (strength >= 3) return "Good";
    if (strength >= 2) return "Medium";
    return "Weak";
  };

  const [pendingMessage, setPendingMessage] = useState("");

React.useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const pendingEmail = params.get("email");
  if (window.location.pathname.includes("pending-verification") && pendingEmail) {
    setPendingMessage(`We sent a verification link to ${pendingEmail}. Please check your inbox.`);
  }
}, []);


  const password = watch("password");
  React.useEffect(() => {
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
      toast.error(
        "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, and a number."
      );
      return;
    }
  
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post("/auth/signup", data);
      toast.success(
        <div>
          <p className="font-bold">Account created successfully!</p>
          <p>Please check your email to verify your account before signing in.</p>
        </div>,
        { autoClose: 5000 }
      );
      
      reset();
      
      // 👇 Instead of jumping straight to signin, give them a bit more time
      setTimeout(() => navigate("/signin?pending-verification=1&email=" + encodeURIComponent(data.email)), 3000);
      
  
      // ✅ STORE EMAIL SAFELY FOR VERIFY MAIL
 // after signup success...
toast.success("Account created! Check your email to verify.", { autoClose:5000 });
reset();
setTimeout(() => navigate("/signin"), 3000);  // send them to Login

    } catch (error) {
      console.error("Error creating user:", error);
      const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
      toast.error(
        <div>
          <p className="font-bold">Registration failed</p>
          <p>{errorMessage}</p>
        </div>,
        { autoClose: 5000 }
      );
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
      default: return "bg-gray-300";
    }
  };

  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <ToastContainer 
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg overflow-hidden flex flex-col lg:flex-row">
        {/* Left Image Section */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <img 
            src={signUpImage} 
            alt="Sign Up" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-center justify-center p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Join Our Community</h3>
              <p className="text-gray-200">Create your account and start your journey with us today.</p>
            </div>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
        {pendingMessage && (
  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded">
    <p className="text-yellow-800 text-sm">{pendingMessage}</p>
  </div>
)}

          <div className="mb-8 text-center">
            <Link to="/">
              <img src={logo} alt="Logo" className="h-18 mb-4 mx-auto cursor-pointer" />
            </Link>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Create an Account</h2>
            <p className="text-gray-600">
              Let's get you all set up so you can access your personal account.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("firstName", { 
                    required: "First Name is required",
                    minLength: {
                      value: 2,
                      message: "First Name must be at least 2 characters"
                    }
                  })}
                  placeholder="First Name"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.firstName ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-green-200"}`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("lastName", { 
                    required: "Last Name is required",
                    minLength: {
                      value: 2,
                      message: "Last Name must be at least 2 characters"
                    }
                  })}
                  placeholder="Last Name"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.lastName ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-green-200"}`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: { 
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
                    message: "Please enter a valid email address" 
                  }
                })}
                placeholder="Email Address"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.email ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-green-200"}`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                {...register("phoneNumber", { 
                  required: "Phone Number is required",
                  pattern: {
                    value: /^[0-9+\-() ]+$/,
                    message: "Please enter a valid phone number"
                  }
                })}
                placeholder="Phone Number"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.phoneNumber ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-green-200"}`}
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  {...register("password", { 
                    required: "Password is required",
                    validate: validatePassword
                  })}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.password ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-green-200"}`}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getPasswordStrengthColor()}`} 
                    style={{ 
                      width: passwordStrength === "Strong" ? "100%" : 
                             passwordStrength === "Good" ? "75%" :
                             passwordStrength === "Medium" ? "50%" : 
                             passwordStrength === "Weak" ? "25%" : "0%" 
                    }}
                  ></div>
                </div>
                <p className={`text-xs mt-1 ${
                  passwordStrength === "Strong" ? "text-green-600" :
                  passwordStrength === "Good" ? "text-green-600" :
                  passwordStrength === "Medium" ? "text-yellow-600" :
                  passwordStrength === "Weak" ? "text-red-600" : "text-gray-600"
                }`}>
                  {passwordStrength ? `Password Strength: ${passwordStrength}` : "Enter password"}
                </p>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    Password must be at least 8 characters with uppercase, lowercase, and number
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  {...register("confirmPassword", { 
                    required: "Please confirm your password",
                    validate: value => 
                      value === watch("password") || "Passwords do not match"
                  })}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.confirmPassword ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-green-200"}`}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  {...register("agreeToTerms", { 
                    required: "You must accept the terms and conditions"
                  })}
                  type="checkbox"
                  className={`w-4 h-4 rounded border ${errors.agreeToTerms ? "border-red-500" : "border-gray-300"} focus:ring-green-500`}
                />
              </div>
              <div className="ml-3 text-sm">
                <label className="text-gray-700">
                  I agree to the{" "}
                  <a href="/terms" className="text-green-600 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-green-600 hover:underline">
                    Privacy Policy
                  </a>{" "}
                  <span className="text-red-500">*</span>
                </label>
                {errors.agreeToTerms && (
                  <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms.message}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className={`w-full py-3 px-4 rounded-lg font-bold transition-colors ${
                isSubmitting || !isValid
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
           

          </form>

          <div className="mt-6 text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/signin" className="text-green-600 font-medium hover:underline">
              Sign In
            </Link>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => handleOAuth("google")}
              className="flex items-center justify-center w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign up with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;