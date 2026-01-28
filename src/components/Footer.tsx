import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaArrowRight,
} from "react-icons/fa";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";

const Footer = () => {
  return (
    <footer className="bg-background text-foreground py-12 px-4 sm:px-6 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Logo and Tagline */}
          <div className="md:col-span-4 flex flex-col items-center text-center">
            <img src={logo} alt="Nigeria Health Watch Logo" className="h-12 w-auto mb-4" />
            <div>
              <p className="text-lg font-semibold text-foreground">Nigeria Health Watch</p>
              <p className="text-sm text-muted-foreground mt-1">Empowering you with the latest health news and insights.</p>
            </div>
          </div>

          {/* Account */}
          <div className="md:col-span-2">
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" />
              Account
            </h4>
            <div className="space-y-2">
              <div>
                <Link to="/login" className="text-muted-foreground hover:text-accent flex items-center gap-1 transition-colors">
                  <FaArrowRight className="text-xs" />
                  Login
                </Link>
              </div>
              <div>
                <Link to="/signup" className="text-muted-foreground hover:text-accent flex items-center gap-1 transition-colors">
                  <FaArrowRight className="text-xs" />
                  Register
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" />
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { name: "Home", href: "#home" },
                { name: "Features", href: "#features" },
                { name: "About Us", href: "#about" },
                { name: "Contact", href: "#contact" },
              ].map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-muted-foreground hover:text-accent flex items-center gap-1 transition-colors">
                    <FaArrowRight className="text-xs" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-3">
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" />
              Newsletter
            </h4>
            <p className="text-sm text-muted-foreground mb-3">Subscribe to our newsletter for the latest updates.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-card text-foreground px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <Button type="submit" className="px-4 py-2">
                Join
              </Button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Healthlens Naija. All rights reserved</p>

          <div className="flex gap-4 items-center">
            {[
              { icon: <FaFacebookF />, href: "#" },
              { icon: <FaTwitter />, href: "#" },
              { icon: <FaInstagram />, href: "#" },
              { icon: <FaLinkedinIn />, href: "#" },
            ].map((social, index) => (
              <a
                key={index}
                href={social.href}
                className="text-muted-foreground hover:text-accent text-lg p-2 rounded-full bg-card hover:bg-accent/10 border border-border transition-colors"
                aria-label={`social-${index}`}
              >
                {social.icon}
              </a>
            ))}

            {/* Theme toggle in footer */}
            <div className="ml-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;