import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ChevronRight,
  Send
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";

const Footer = () => {
  return (
    <footer className="bg-muted/30 pt-16 pb-8 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="flex items-center gap-2">
                <img src={logo} alt="Nigeria Health Watch" className="h-10 w-auto" />
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              Empowering journalists with AI-driven insights for deeper, faster, and more accurate health reporting across Nigeria.
            </p>
            <div className="flex gap-3">
               {[
                  { icon: <Facebook className="h-4 w-4" />, href: "#" },
                  { icon: <Twitter className="h-4 w-4" />, href: "#" },
                  { icon: <Instagram className="h-4 w-4" />, href: "#" },
                  { icon: <Linkedin className="h-4 w-4" />, href: "#" },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-background border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all duration-300 shadow-sm"
                    aria-label={`social-${index}`}
                  >
                    {social.icon}
                  </a>
                ))}
            </div>
          </div>

          {/* Account Links */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-foreground mb-6">Account</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/login" className="text-muted-foreground hover:text-primary transition-colors flex items-center group">
                  <ChevronRight className="h-3 w-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-muted-foreground hover:text-primary transition-colors flex items-center group">
                  <ChevronRight className="h-3 w-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3">
             <h4 className="font-bold text-foreground mb-6">Company</h4>
            <ul className="space-y-4">
              {[
                { name: "Features", href: "/features" },
                { name: "About Us", href: "/about" },
                { name: "Contact", href: "/contact" },
                { name: "Privacy Policy", href: "#" },
              ].map((link, index) => (
                <li key={index}>
                  <Link to={link.href} className="text-muted-foreground hover:text-primary transition-colors flex items-center group">
                    <ChevronRight className="h-3 w-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <h4 className="font-bold text-foreground mb-6">Stay Updated</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Get the latest updates on health reporting tools and insights.
            </p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                 <Input 
                   type="email" 
                   placeholder="Enter your email" 
                   className="bg-background border-border focus-visible:ring-primary h-11 pr-12"
                 />
                 <Button 
                   size="icon" 
                   type="submit" 
                   className="absolute right-1 top-1 h-9 w-9 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                 >
                    <Send className="h-4 w-4" />
                 </Button>
              </div>
            </form>
          </div>
        </div>

        <Separator className="bg-border my-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground order-2 md:order-1">
            © {new Date().getFullYear()} HealthLens Naija. All rights reserved.
          </p>
          
          <div className="order-1 md:order-2">
             <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;