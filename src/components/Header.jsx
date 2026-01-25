import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaBars, FaUser, FaUserPlus } from "react-icons/fa";
import logo from "../assets/logo.png";
import "../index.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

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
    { path: "/about", text: "About Us" },
    { path: "/features", text: "Features" },
    { path: "/contact", text: "Contact Us" }
  ];

  return (
    <motion.header 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full bg-white shadow-sm sticky top-0 z-50"
    >
      <div className="container mx-auto flex items-center justify-between px-4 lg:px-6 py-3">
        {/* Logo */}
        <motion.div 
          variants={itemVariants}
          className="flex-shrink-0"
        >
          <Link to="/">
            <motion.img
              src={logo}
              alt="Nigeria Health Watch"
              className="h-12"
              whilehover={{ scale: 1.05 }}
              whiletap={{ scale: 0.95 }}
            />
          </Link>
        </motion.div>

        {/* Navigation Links (Desktop) */}
        <motion.nav 
          variants={containerVariants}
          className="hidden lg:flex space-x-8 mx-8"
        >
          {navLinks.map((link, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whilehover={{ y: -2 }}
              whiletap={{ scale: 0.95 }}
            >
              <Link 
                to={link.path} 
                className="text-gray-800 hover:text-green-600 font-medium relative group transition-colors"
              >
                {link.text}
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </motion.div>
          ))}
        </motion.nav>

        {/* Auth Buttons (Desktop) */}
        <motion.div 
          variants={containerVariants}
          className="hidden lg:flex space-x-4"
        >
          <motion.div variants={itemVariants}>
            <Link 
              to="/signin"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-5 rounded-lg font-medium transition-colors"
              whilehover={{ scale: 1.05 }}
              whiletap={{ scale: 0.95 }}
            >
              <FaUser className="text-sm" />
              Login
            </Link>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Link
              to="/signup"
              className="flex items-center gap-2 bg-white text-green-600 hover:text-green-700 py-2 px-5 rounded-lg font-medium border-2 border-green-600 hover:border-green-700 transition-colors"
              whilehover={{ scale: 1.05 }}
              whiletap={{ scale: 0.95 }}
            >
              <FaUserPlus className="text-sm" />
              Sign Up
            </Link>
          </motion.div>
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button
          variants={itemVariants}
          className="lg:hidden text-gray-800 focus:outline-none p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          whilehover={{ scale: 1.1 }}
          whiletap={{ scale: 0.95 }}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <FaTimes className="w-5 h-5" />
          ) : (
            <FaBars className="w-5 h-5" />
          )}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileMenuVariants}
            className="w-full bg-white lg:hidden overflow-hidden shadow-md"
          >
            <div className="container mx-auto px-4 py-2">
              <motion.nav 
                className="flex flex-col space-y-4 py-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {navLinks.map((link, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Link 
                      to={link.path} 
                      className="block py-2 text-gray-800 hover:text-green-600 font-medium transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.text}
                    </Link>
                  </motion.div>
                ))}
              </motion.nav>
              <div className="flex flex-col space-y-4 pb-4">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link
                    to="/signin"
                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-5 rounded-lg font-medium transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <FaUser className="text-sm" />
                    Login
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <Link
                    to="/signup"
                    className="flex items-center justify-center gap-2 bg-white text-green-600 hover:text-green-700 py-2 px-5 rounded-lg font-medium border-2 border-green-600 hover:border-green-700 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <FaUserPlus className="text-sm" />
                    Sign Up
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;