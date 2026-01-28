import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn,
  FaArrowRight
} from "react-icons/fa";

const Footer = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
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

  const socialIconVariants = {
    hover: {
      y: -5,
      scale: 1.1,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  };

  const linkVariants = {
    hover: {
      x: 5,
      transition: { type: "spring", stiffness: 300 }
    }
  };

  const combinedVariants = {
    ...itemVariants,
    hover: socialIconVariants.hover,
  };
  

  return (
    <motion.footer 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="bg-gray-100 text-black py-12 px-4 sm:px-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Logo and Tagline - Now stacked vertically */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-4 flex flex-col items-center text-center"
          >
            <motion.img
              src={logo}
              alt="Nigeria Health Watch Logo"
              className="h-12 w-auto mb-4"
              whileHover={{ rotate: [0, -5, 5, -5, 0] }}
              transition={{ duration: 0.5 }}
            />
            <div>
              <p className="text-xl font-bold text-gray-900">
                Nigeria Health Watch
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Empowering you with the latest health news and insights.
              </p>
            </div>
          </motion.div>

          {/* Account */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-2"
          >
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Account
            </h4>
            <div className="space-y-2">
              <motion.div whileHover="hover" variants={linkVariants}>
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-green-600 flex items-center gap-1 transition-colors"
                >
                  <FaArrowRight className="text-xs" />
                  Login
                </Link>
              </motion.div>
              <motion.div whileHover="hover" variants={linkVariants}>
                <Link 
                  to="/signup" 
                  className="text-gray-600 hover:text-green-600 flex items-center gap-1 transition-colors"
                >
                  <FaArrowRight className="text-xs" />
                  Register
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-3"
          >
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { name: "Home", href: "#home" },
                { name: "Features", href: "#features" },
                { name: "About Us", href: "#about" },
                { name: "Contact", href: "#contact" }
              ].map((link, index) => (
                <motion.li 
                  key={index}
                  whileHover="hover"
                  variants={linkVariants}
                >
                  <a 
                    href={link.href} 
                    className="text-gray-600 hover:text-green-600 flex items-center gap-1 transition-colors"
                  >
                    <FaArrowRight className="text-xs" />
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-3"
          >
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              Newsletter
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Subscribe to our newsletter for the latest updates.
            </p>
            <motion.form 
              className="flex gap-2"
              whileHover={{ scale: 1.02 }}
            >
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-white text-gray-800 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <motion.button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Join
              </motion.button>
            </motion.form>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div 
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-8"
        />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          {/* Copyright */}
          <motion.p 
            variants={itemVariants}
            className="text-sm text-gray-500"
          >
            © {new Date().getFullYear()} Healthlens Naija. All rights reserved
          </motion.p>

          {/* Social Media */}
          <motion.div 
            variants={containerVariants}
            className="flex gap-4"
          >
            {[
              { icon: <FaFacebookF />, href: "#" },
              { icon: <FaTwitter />, href: "#" },
              { icon: <FaInstagram />, href: "#" },
              { icon: <FaLinkedinIn />, href: "#" }
            ].map((social, index) => (
              <motion.a
                key={index}
                whileHover="hover"
                variants={combinedVariants}
                href={social.href}
                className="text-gray-600 hover:text-white text-lg p-2 rounded-full bg-white hover:bg-green-600 border border-gray-300 hover:border-green-600 transition-colors"
                aria-label={`${social.icon.type.displayName} link`}
              >
                {social.icon}
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;