import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaPenFancy, FaComments, FaUpload, FaChartLine, FaLightbulb, FaSearch } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const Features = () => {
  const features = [
    { title: "AI-Powered Story Generation", description: "Craft compelling stories in seconds using our advanced AI technology that understands context and narrative structure.", icon: <FaPenFancy className="text-4xl" /> },
    { title: "Interactive Conversations", description: "Collaborate with AI for brainstorming, Q&A, and real-time insights through natural language processing.", icon: <FaComments className="text-4xl" /> },
    { title: "Data Upload & Processing", description: "Upload documents to summarize, analyze, or review with precision using our document intelligence features.", icon: <FaUpload className="text-4xl" /> },
    { title: "Performance Analytics", description: "Track and manage your progress with actionable metrics and comprehensive reports.", icon: <FaChartLine className="text-4xl" /> },
    { title: "Smart Recommendations", description: "Get personalized suggestions to improve your content based on AI analysis of your writing patterns.", icon: <FaLightbulb className="text-4xl" /> },
    { title: "Advanced Search", description: "Quickly find relevant information across all your documents with semantic search capabilities.", icon: <FaSearch className="text-4xl" /> },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, when: "beforeChildren" } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 10 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 15 
      } 
    },
    hover: { 
      y: -10, 
      boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      } 
    }
  };

  const iconVariants = {
    hover: {
      rotate: [0, 10, -10, 0],
      scale: [1, 1.1, 1.1, 1],
      transition: {
        duration: 0.8
      }
    }
  };

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <motion.section
      id="features"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
        <motion.h2
  className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-green-500"
  whileHover={{ scale: 1.02 }}
>
  What We Offer
</motion.h2>
          <motion.p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover powerful tools to elevate your storytelling.
          </motion.p>
          <motion.div className="h-1 w-20 bg-green-500 mx-auto mt-6" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ duration: 0.5 }} />
        </motion.div>

        {/* Swiper */}
        <motion.div variants={itemVariants}>
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current
            }}
            onInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
            }}
            pagination={{ clickable: true, dynamicBullets: true }}
            breakpoints={{
              640: { slidesPerView: 1, spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 30 },
              1024: { slidesPerView: 3, spaceBetween: 40 },
              1280: { slidesPerView: 4, spaceBetween: 30 }
            }}
            className="pb-16"
          >
            {features.map((feature, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  whilehover="hover"
                  viewport={{ once: true }}
                  variants={cardVariants}
                  className="h-full flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-md border border-gray-100 transition-all"
                  style={{ minHeight: '400px' }} // Fixed height for all cards
                >
                  <motion.div 
                    variants={iconVariants}
                    className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-6 text-green-500"
                  >
                    {feature.icon}
                  </motion.div>
                  <div className="flex flex-col flex-grow justify-between">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <div className="flex justify-center mt-8 space-x-4">
            <button ref={prevRef} className="bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <button ref={nextRef} className="bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Features;