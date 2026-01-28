// src/components/HomeFeatures.jsx
import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaPenFancy, FaComments, FaUpload, FaChartLine, FaLightbulb, FaSearch } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const HomeFeatures = () => {
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

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <motion.section
      id="home-features"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto text-center">
        <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
          Key Features
        </motion.h2>
        <motion.p variants={itemVariants} className="text-md text-gray-600 max-w-2xl mx-auto mb-8">
          Powerful tools to help you write, analyze and publish better stories—fast.
        </motion.p>

        <motion.div variants={itemVariants}>
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
            navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
            onInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
            }}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 1, spaceBetween: 16 },
              768: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
            }}
          >
            {features.map((feature, i) => (
              <SwiperSlide key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 h-full flex flex-col items-start"
                  style={{ minHeight: 220 }}
                >
                  <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mb-4 text-green-500">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="flex justify-center mt-6 space-x-3">
            <button ref={prevRef} className="bg-white p-2 rounded-full shadow-sm hover:bg-gray-100">
              ‹
            </button>
            <button ref={nextRef} className="bg-white p-2 rounded-full shadow-sm hover:bg-gray-100">
              ›
            </button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HomeFeatures;
