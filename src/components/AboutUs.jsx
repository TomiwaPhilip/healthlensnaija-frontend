import React from "react";
import { motion } from "framer-motion";
import { 
  FaHeartbeat, 
  FaUserMd, 
  FaNewspaper, 
  FaAward, 
  FaUsers, 
  FaChartLine, 
  FaArrowRight,
  FaRobot,
  FaComments,
  FaUserTie,
  FaSearch,
  FaLightbulb,
  FaMicroscope
} from "react-icons/fa";

const AboutUs = () => {
  // Animation variants matching hero section
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

  const features = [
    {
      icon: <FaHeartbeat className="text-4xl text-green-500" />,
      title: "Health Advocacy",
      description: "Using advocacy and communication to reduce health inequalities"
    },
    {
      icon: <FaUserMd className="text-4xl text-green-500" />,
      title: "Evidence-Based",
      description: "Data-driven insights and evidence-based health reporting"
    },
    {
      icon: <FaNewspaper className="text-4xl text-purple-500" />,
      title: "Quality Journalism",
      description: "Credible, verified health information and analysis"
    }
  ];

  const values = [
    {
      icon: <FaAward className="text-3xl text-green-500" />,
      title: "Excellence",
      description: "Commitment to highest standards in health journalism"
    },
    {
      icon: <FaUsers className="text-3xl text-green-500" />,
      title: "Collaboration",
      description: "Working with partners to improve health outcomes"
    },
    {
      icon: <FaChartLine className="text-3xl text-purple-500" />,
      title: "Impact",
      description: "Driving measurable change in healthcare delivery"
    }
  ];

  const healthLensFeatures = [
    {
      icon: <FaRobot className="text-3xl text-green-500" />,
      title: "AI-Powered Story Generator",
      description: "Generates data-driven, contextually relevant story ideas aligned with the Four Point Agenda"
    },
    {
      icon: <FaComments className="text-3xl text-green-500" />,
      title: "Interactive Chatbot",
      description: "Guides users through story development and helps brainstorm angles using existing data"
    },
    {
      icon: <FaUserTie className="text-3xl text-purple-500" />,
      title: "Expert Recommendations",
      description: "Provides credible subject matter experts based on story topics and angles"
    }
  ];

  const targetUsers = [
    "Health and investigative journalists",
    "Newsrooms",
    "Civil society organisations focused on health advocacy",
    "Public health communications professionals",
    "Public Health researchers and analysts"
  ];

  return (
    <motion.section 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative py-16 md:py-24 lg:py-32 px-4 overflow-hidden"
    >
      {/* Animated background elements matching hero */}
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

      <div className="relative max-w-6xl mx-auto">
        {/* Title Section */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6 text-gray-900"
            whileHover={{ scale: 1.02 }}
          >
            About Nigeria Health Watch
          </motion.h1>
          <motion.div 
            className="h-1 w-20 bg-green-500 mx-auto"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>

        {/* Mission Section */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <motion.h2 
            className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6"
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Our Mission
          </motion.h2>
          <motion.p 
            className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            To use communication and advocacy to influence health policy and seek better health and 
            access to quality healthcare for Nigerians through cutting-edge advocacy, credible health 
            reportage, and strategic stakeholder engagement.
          </motion.p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
          {/* What We Do */}
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">What We Do</h3>
            <div className="space-y-4">
              <motion.p 
                className="text-lg text-gray-600 leading-relaxed"
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Nigeria Health Watch is a not-for-profit health communication and advocacy organization 
                that advocates for quality healthcare for Nigerians. We work to hold leaders accountable 
                for their health promises and collaborate with partners to implement innovative solutions 
                to health system challenges.
              </motion.p>
              
              <motion.p 
                className="text-lg text-gray-600 leading-relaxed"
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                Through our platforms, we provide a space for constructive dialogue and disseminate 
                credible health information to influence health policy and practice in Nigeria.
              </motion.p>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div variants={itemVariants} className="space-y-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                transition={{ type: "spring", stiffness: 300 }}
                className="p-6 bg-white rounded-xl shadow-md flex items-start space-x-4 border border-gray-100"
              >
                <div className="flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* HealthLensNaija Section */}
        <motion.div 
          variants={itemVariants}
          className="bg-gradient-to-r from-green-50 to-green-50 rounded-2xl p-8 md:p-12 mb-16 border border-green-100"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <motion.h2 
                className="text-3xl font-bold text-gray-800 mb-4"
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                HealthLensNaija: AI-Powered Health Journalism
              </motion.h2>
              <motion.p 
                className="text-lg text-gray-600 mb-6 leading-relaxed"
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                An AI-powered tool developed by Nigeria Health Watch to strengthen media coverage and 
                accountability of Nigeria's health sector. HealthLensNaija monitors and tracks the 
                Federal Ministry of Health and Social Welfare's Four Point Agenda, serving as a critical 
                resource for journalists and health advocates.
              </motion.p>
              
              <motion.div 
                className="bg-white rounded-lg p-6 mb-6 shadow-sm border-l-4 border-green-500"
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <FaSearch className="text-green-500 mr-2" />
                  Addressing Key Challenges
                </h4>
                <p className="text-gray-600">
                  Health journalists face challenges in covering complex health policy issues, including 
                  time-consuming story ideation, difficulty accessing credible data, and barriers to 
                  connecting with relevant experts.
                </p>
              </motion.div>

              <motion.h4 
                className="text-xl font-semibold text-gray-800 mb-4"
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                Who is HealthLensNaija for?
              </motion.h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                {targetUsers.map((user, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-center text-gray-600"
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <FaUsers className="text-green-500 mr-2 text-sm" />
                    {user}
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              {healthLensFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="p-6 bg-white rounded-xl shadow-md flex items-start space-x-4 border border-gray-100"
                >
                  <div className="flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Our Values */}
        <motion.div variants={itemVariants} className="mb-16">
          <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">Our Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="p-6 bg-white rounded-lg shadow-sm text-center border border-gray-100"
              >
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">{value.title}</h4>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          variants={itemVariants}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
        >
          {[
            { number: "15+", label: "Years of Impact" },
            { number: "2000+", label: "Health Stories" },
            { number: "50+", label: "Partners" },
            { number: "1M+", label: "Lives Touched" }
          ].map((stat, index) => (
            <motion.div 
              key={index}
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-white rounded-lg shadow-sm border border-gray-100"
            >
              <p className="text-3xl font-bold text-green-600 mb-2">{stat.number}</p>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          variants={itemVariants}
          className="text-center mt-16"
        >
          <motion.button
            className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-medium text-white bg-green-500 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <span className="relative z-10 flex items-center">
              Join Our Mission
              <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="absolute inset-0 bg-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default AboutUs;