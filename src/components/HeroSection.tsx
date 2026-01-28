import React from "react";
import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
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
      className="relative w-full min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden bg-background px-4 md:px-8 lg:px-12 py-12 lg:py-0"
    >
      {/* Animated background elements */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.06 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-primary mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"
      />
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.06 }}
        transition={{ duration: 1.5, delay: 0.8 }}
        className="absolute top-1/2 -right-20 w-96 h-96 rounded-full bg-primary mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"
      />

      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl">
        
        {/* Left Column: Text */}
        <div className="text-left relative z-10">
          <motion.div variants={itemVariants} className="mb-4">
            <Badge variant="secondary" className="px-4 py-2 text-primary font-semibold text-sm tracking-wide rounded-full">
              Powering Health Narratives
            </Badge>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight mb-6 text-foreground tracking-tight"
          >
            <div className="min-h-[3.6em] sm:min-h-[3em] lg:min-h-[3.6em]">
            <Typewriter
              options={{
                cursorClassName: "typewriter-cursor text-primary",
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
                  .typeString('<br/><span class="text-primary">Quality Reporting </span>')
                  .pauseFor(300)
                  .typeString('with AI')
                  .start();
              }}
            />
            </div>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="mt-4 text-sm md:text-base text-muted-foreground max-w-lg leading-relaxed"
          >
            Empowering journalists and health professionals with the latest insights through AI-powered storytelling and analysis.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Button onClick={handleGetStarted} className="px-6 py-6 text-lg" size="lg">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" onClick={() => navigate("/features")} className="px-6 py-6 text-lg">
              Learn More
            </Button>
          </motion.div>
        </div>

        {/* Right Column: Image */}
        <motion.div 
          variants={imageVariants}
          whileHover="hover"
          className="relative z-10 hidden lg:block"
        >
          <div className="relative rounded-2xl p-2 bg-gradient-to-b from-card/40 to-card/10 backdrop-blur-md border border-border shadow-2xl">
              <img 
                src={featuresImage} 
                alt="HealthLens Dashboard" 
                className="w-full h-auto rounded-xl shadow-sm bg-background/50"
              />
              {/* Floating element decorative */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-xl border border-border flex items-center gap-3"
              >
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Analysis Status</div>
                    <div className="text-sm font-bold text-foreground">Complete</div>
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
            className="w-full h-auto rounded-xl shadow-lg border border-border"
          />
        </motion.div>

      </div>
    </motion.section>
  );
};

export default HeroSection;