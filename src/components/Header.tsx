import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogIn, UserPlus } from "lucide-react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";
import logo from "../assets/logo.png";
import "../index.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { path: "/", text: "Home" },
    { path: "/about", text: "About Us" },
    { path: "/features", text: "Features" },
    { path: "/contact", text: "Contact" }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled 
          ? "bg-background/80 backdrop-blur-md shadow-sm border-border" 
          : "bg-transparent border-transparent backdrop-blur-none"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex-shrink-0 mr-4">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="Nigeria Health Watch" className="h-10 w-auto" />
          </Link>
        </div>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link, index) => {
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={index}
                to={link.path} 
                className={`relative transition-colors hover:text-primary ${
                  isActive ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
              >
                {link.text}
                {isActive && (
                   <span className="absolute -bottom-[21px] left-0 h-[2px] w-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions (Desktop) */}
        <div className="hidden lg:flex items-center gap-4">
          <ThemeToggle />
          <div className="h-6 w-px bg-border" />
          <Button variant="ghost" asChild className="text-foreground hover:text-primary hover:bg-primary/10">
            <Link to="/signin">Login</Link>
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md">
            <Link to="/signup">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-4 lg:hidden">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-border bg-background lg:hidden animate-in slide-in-from-top-5 fade-in duration-200">
          <div className="container py-4 space-y-4 px-4">
            <nav className="grid gap-2">
              {navLinks.map((link, index) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link 
                    key={index}
                    to={link.path} 
                    className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "hover:bg-accent hover:text-accent-foreground text-foreground"
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.text}
                  </Link>
                );
              })}
            </nav>
            <div className="h-px bg-border my-4" />
            <div className="grid gap-2">
              <Button asChild variant="outline" className="w-full justify-start border-border text-foreground hover:bg-accent hover:text-accent-foreground">
                <Link to="/signin" onClick={() => setMenuOpen(false)}>
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
              <Button asChild className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/signup" onClick={() => setMenuOpen(false)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;