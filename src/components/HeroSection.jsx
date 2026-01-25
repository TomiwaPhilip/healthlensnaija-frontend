import React from "react";
import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import featuresImage from "../assets/Main-dashboard.svg";
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

  const imageVariants = {
    hidden: { scale: 0.9, opacity: 0, x: 20 },
    visible: {
      scale: 1,
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 20,
        delay: 0.5
      }
    },
    hover: {
      scale: 1.02,
      rotate: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.section 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative w-full min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden bg-white px-4 md:px-8 lg:px-12 py-12 lg:py-0"
    >
      {/* Animated background elements */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-[#3AB54A] mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"
      />
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.1 }}
        transition={{ duration: 1.5, delay: 0.8 }}
        className="absolute top-1/2 -right-20 w-96 h-96 rounded-full bg-[#8CC43D] mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"
      />

      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl">
        
        {/* Left Column: Text */}
        <div className="text-left relative z-10">
          <motion.div variants={itemVariants} className="mb-2">
            <span className="px-4 py-2 rounded-full bg-[#3AB54A]/10 text-[#3AB54A] font-semibold text-sm tracking-wide">
              Powering Health Narratives
            </span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight mb-6 text-gray-900"
          >
            <div className="min-h-[3.6em] sm:min-h-[3em] lg:min-h-[3.6em]">
            <Typewriter
              options={{
                cursorClassName: "typewriter-cursor text-[#3AB54A]",
                delay: 40,
                deleteSpeed: 30,
                autoStart: true,
                loop: false
              }}
              onInit={(typewriter) => {
                typewriter
                  .pauseFor(500)
                  .typeString('Transform Health <br/>Story Ideas Into ')
                  .pauseFor(300)
                  .typeString('<br/><span class="text-[#3AB54A]">Quality Reporting </span>')
                  .pauseFor(300)
                  .typeString('with AI')
                  .start();
              }}
            />
            </div>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="mt-4 text-lg md:text-xl text-gray-600 max-w-lg leading-relaxed"
          >
            Empowering journalists and health professionals with the latest insights through AI-powered storytelling and analysis.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="mt-10 flex flex-wrap gap-4"
          >
            <motion.button
              onClick={handleGetStarted}
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-[#3AB54A] rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3AB54A] hover:bg-[#2d963c] hover:shadow-lg transform hover:-translate-y-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Now
              <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.button
              onClick={() => navigate("/features")}
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-gray-700 transition-all duration-200 bg-white border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </motion.div>
        </div>

        {/* Right Column: Image */}
        <motion.div 
          variants={imageVariants}
          whileHover="hover"
          className="relative z-10 hidden lg:block"
        >
          <div className="relative rounded-2xl p-2 bg-gradient-to-b from-white/40 to-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
              <img 
                src={featuresImage} 
                alt="HealthLens Dashboard" 
                className="w-full h-auto rounded-xl shadow-sm"
              />
              {/* Floating element decorative */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-gray-100 flex items-center gap-3"
              >
                  <div className="w-10 h-10 rounded-full bg-[#3AB54A]/20 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-[#3AB54A]" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Analysis Status</div>
                    <div className="text-sm font-bold text-gray-800">Complete</div>
                  </div>
              </motion.div>
          </div>
        </motion.div>
        
        {/* Mobile Image (shown below text on small screens) */}
         <motion.div 
          variants={itemVariants}
          className="relative z-10 lg:hidden mt-8"
        >
          <img 
            src={featuresImage} 
            alt="HealthLens Dashboard" 
            className="w-full h-auto rounded-xl shadow-lg border border-gray-100"
          />
        </motion.div>

      </div>
    </motion.section>
  );
};

export default HeroSection;