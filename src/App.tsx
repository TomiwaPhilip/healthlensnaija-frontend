import React, { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import PendingVerification from "./pages/PendingVerification";

import Header from "./components/Header";
import Footer from "./components/Footer";
// import Dashboard from "./pages/Dashboard/Dashboard";
import GenerateStory from "./pages/Dashboard/GenerateStory";
import UploadData from "./pages/Dashboard/UploadData";
import AIChat from "./pages/Dashboard/AIChat";
import HeroSection from "./components/HeroSection";
import Features from "./components/Features";
import Testimonials from "./components/Testimonials";
import WhyNHWSection from "./components/WhyNHWSection";
import AboutUs from "./components/AboutUs";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import OAuthCallback from "./pages/OAuthCallback";
import SettingsPage from "./pages/Dashboard/Settings";
import HelpCenterPage from "./pages/Dashboard/HelpCenter";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Resources from "./pages/Dashboard/Resources";
import VerifyOTP from "./pages/VerifyOTP";
import StoryEditor from "./pages/StoryEditor";
import ProtectedRouteAdmin from "./components/ProtectedRouteAdmin";
import AdminPage from "./pages/Admin/AdminPage";
import Contact from "./pages/Contact";
import FeaturesPage from "./pages/FeaturesPage";
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ New stable one
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const allowedRedirects = [
  "/generate-story",
  "/upload-data",
  "/ai-chat",
  "/settings",
  "/help-center",
  "/resources",
  "/features",
  "/contact",
];

const App = () => {
  console.log("App component is rendering");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("App useEffect running");
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token);
    setIsAuthenticated(!!token);
    setIsLoading(false);
    console.log("isLoading set to false");
  }, []);

  const validateRedirect = (path) => {
    return allowedRedirects.includes(path) ? path : "/signin";
  };

  console.log("Rendering App with isLoading:", isLoading);
  if (isLoading) {
    console.log("App is in loading state, returning null");
    return null;
  }

  return (
    <Router>
      <div className="w-full min-h-screen bg-background text-foreground">
        <ToastContainer
          position="bottom-right"
          autoClose={2000}
          hideProgressBar
          theme="colored"
        />

        <Routes>
          {/* 🌍 Public Routes */}
          <Route
            path="/"
            element={
              <>
                <Header />
                <HeroSection />
                <Features />
                <WhyNHWSection />
                <Testimonials />
                <Footer />
              </>
            }
          />
          <Route
            path="/about"
            element={
              <>
                <Header />
                <AboutUs />
                <Footer />
              </>
            }
          />
          <Route
            path="/signup"
            element={
              <>
                <Header />
                <SignUp />
                <Footer />
              </>
            }
          />
          <Route
            path="/contact"
            element={
              <>
                <Header />
                <Contact />
                <Footer />
              </>
            }
          />
          <Route
            path="/signin"
            element={
              <>
                <Header />
                <SignIn />
                <Footer />
              </>
            }
          />
          <Route path="/features" element={<FeaturesPage />} />
          <Route
            path="/forgot-password"
            element={
              <>
                <Header />
                <ForgotPassword />
                <Footer />
              </>
            }
          />
          <Route
            path="/reset-password/:token"
            element={
              <>
                <Header />
                <ResetPassword />
                <Footer />
              </>
            }
          />
          <Route path="/pending-verification" element={<PendingVerification />} />
          <Route path="/oauth/callback" element={<OAuthCallback />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/story-editor" element={<StoryEditor />} />

          {/* 🛡️ Protected Dashboard Routes (Persistent Layout) */}
          <Route element={<ProtectedRoute />}>
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
            <Route path="/dashboard" element={<GenerateStory />} />
            <Route path="/upload-data" element={<UploadData />} />
            <Route path="/ai-chat" element={<AIChat />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/help-center" element={<HelpCenterPage />} />
            <Route path="/resources" element={<Resources />} />
            
            {/* 🔧 Admin Routes with Nested Routing */}
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRouteAdmin>
                  <AdminPage />
                </ProtectedRouteAdmin>
              } 
            />
          </Route>

          {/* 🚧 Fallback — send unknown paths to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;