import React from "react";
import { motion } from "framer-motion";
import  Typewriter  from "typewriter-effect";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import "../index.css";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/signup");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
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

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 20px rgba(16, 185, 129, 0.3)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <motion.section 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative text-center py-16 md:py-24 lg:py-32 px-4 overflow-hidden"
    >
      {/* Animated background elements */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-green-500 mix-blend-multiply filter blur-3xl opacity-10 animate-blob"
      />
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.1 }}
        transition={{ duration: 1.5, delay: 0.8 }}
        className="absolute top-0 right-20 w-64 h-64 rounded-full bg-green-500 mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"
      />
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.1 }}
        transition={{ duration: 1.5, delay: 1.1 }}
        className="absolute -bottom-8 left-20 w-64 h-64 rounded-full bg-purple-500 mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"
      />

      <div className="relative max-w-4xl mx-auto">
        <motion.h1 
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6"
        >
          <Typewriter
            options={{
              cursorClassName: "typewriter-cursor",
              delay: 50,
              deleteSpeed: 30,
              autoStart: true,
              loop: false
            }}
            onInit={(typewriter) => {
              typewriter
                .pauseFor(500)
                .typeString('<span class="text-gray-900">Transform Health Story Ideas Into </span>')
                .pauseFor(300)
                .typeString('<br/><span class="text-green-500 bg-clip-text bg-gradient-to-r from-green-400 to-green-600">Quality Reporting </span>')
                .pauseFor(300)
                .typeString('<span class="text-gray-900">with AI</span>')
                .start();
            }}
          />
        </motion.h1>

        <motion.p 
          variants={itemVariants}
          className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
        >
Empowering you with the latest health news and insights through AI-powered storytelling.
        </motion.p>

        <motion.div 
          variants={itemVariants}
          className="mt-10"
        >
          <motion.button
            onClick={handleGetStarted}
            className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-medium text-white bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            variants={buttonVariants}
            whilehover="hover"
            whiletap="tap"
          >
            <span className="relative z-10 flex items-center">
              Get started now
              <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </motion.button>
        </motion.div>

        {/* <motion.div 
          variants={itemVariants}
          className="mt-12 flex justify-center space-x-6"
        >
          {[1, 2, 3, 4, 5].map((item) => (
            <motion.div
              key={item}
              className="text-gray-400 font-medium text-sm"
              whilehover={{ y: -5 }}
            >
              Trusted by {item}K+ users
            </motion.div>
          ))}
        </motion.div> */}
      </div>
    </motion.section>
  );
};

export default HeroSection;