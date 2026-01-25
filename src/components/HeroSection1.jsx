import React from "react";
import { motion } from "framer-motion";
import featuresImage from "../assets/Main-dashboard.svg";
import "../index.css";

const Hero = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const imageVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.3 }
    }
  };

  const shadowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 0.4,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.section 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative text-center py-8 md:py-12 lg:py-16 px-0 overflow-hidden" // Changed px-4 to px-0
    >
      {/* Main image with animation - removed max-w constraints to allow edge-to-edge */}
      <motion.div
        className="relative z-10 w-full"
        variants={imageVariants}
        whilehover="hover"
      >
        <motion.img 
          src={featuresImage} 
          alt="Dashboard Features" 
          className="mx-auto w-full" // Removed max-w constraints
          style={{ width: '100%' }}
        />
      </motion.div>

      {/* Floating shadow effect - adjusted to match new width */}
      <motion.div
        variants={shadowVariants}
        className="absolute bottom-0 left-0 right-0 w-full h-8 bg-gray-400 blur-xl" // Changed to w-full
        style={{ filter: "blur(30px)" }}
      />
    </motion.section>
  );
};

export default Hero;