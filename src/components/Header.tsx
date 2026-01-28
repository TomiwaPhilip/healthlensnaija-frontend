import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
// removed framer-motion to avoid transform errors
import { Menu, X, LogIn, UserPlus } from "lucide-react";
import { Button } from "./ui/button";
import logo from "../assets/logo.png";
import "../index.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const mobileMenuVariants = {
    hidden: { 
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    visible: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const navLinks = [
    { path: "/", text: "Home" },
    { path: "/about", text: "About Us" },
    { path: "/features", text: "Features" },
    { path: "/contact", text: "Contact Us" }
  ];

  return (
    <header className="w-full bg-background sticky top-0 z-50 border-b border-border">
      <div className="container mx-auto flex items-center justify-between px-4 lg:px-6 py-3">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link to="/">
            <img src={logo} alt="Nigeria Health Watch" className="h-12" />
          </Link>
        </div>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden lg:flex space-x-8 mx-8">
          {navLinks.map((link, index) => {
            const isActive = location.pathname === link.path;
            
            return (
              <div key={index}>
                <Link 
                  to={link.path} 
                  className={`font-medium relative group transition-colors ${isActive ? 'text-accent text-accent-foreground' : 'text-foreground/90 hover:text-accent'}`}
                >
                  {link.text}
                  <span className={`absolute left-0 bottom-0 h-0.5 bg-accent transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Auth Buttons (Desktop) */}
        <div className="hidden lg:flex items-center space-x-4">
          <div>
            <Button asChild variant="ghost" size="default">
              <Link to="/signin" className="flex items-center gap-2 px-4 py-2">
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </Link>
            </Button>
          </div>
          <div>
            <Button asChild variant="default" size="default">
              <Link to="/signup" className="flex items-center gap-2 px-4 py-2">
                <UserPlus className="w-5 h-5" />
                <span>Get Started</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-gray-800 focus:outline-none p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="w-full bg-background lg:hidden overflow-hidden shadow-md border-t border-border">
          <div className="container mx-auto px-4 py-2">
            <nav className="flex flex-col space-y-4 py-4">
              {navLinks.map((link, index) => {
                const isActive = location.pathname === link.path;
                return (
                  <div key={index}>
                    <Link 
                      to={link.path} 
                      className={`block py-2 font-medium transition-colors ${isActive ? 'text-accent' : 'text-foreground/70 hover:text-accent'}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.text}
                    </Link>
                  </div>
                );
              })}
            </nav>
            <div className="flex flex-col space-y-4 pb-4 px-2">
              <div>
                <Link
                  to="/signin"
                  className="flex w-full items-center justify-center gap-2 text-foreground bg-muted hover:bg-muted/80 py-3 rounded-xl font-medium transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <LogIn className="w-5 h-5" />
                  <span>Login</span>
                </Link>
              </div>
              <div>
                <Link
                  to="/signup"
                  className="flex w-full items-center justify-center gap-2 bg-[#3AB54A] hover:bg-[#2d963c] text-white py-3 rounded-xl font-medium shadow-md transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Get Started</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;