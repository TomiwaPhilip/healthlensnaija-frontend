// src/pages/FeaturesPage.jsx
import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaPenFancy, FaComments, FaUpload, FaChartLine, FaLightbulb, FaSearch, FaRobot, FaFilePdf, FaCogs, FaShieldAlt } from "react-icons/fa";

const FeatureCard = ({ title, description, useCases, icon, index, isReversed = false }) => {
  const cardAnimation = {
    hidden: { opacity: 0, x: isReversed ? 50 : -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, delay: index * 0.2 }
    }
  };

  const contentAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, delay: (index * 0.2) + 0.3 }
    }
  };

  return (
    <div className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 mb-16`}>
      {/* Card */}
      <motion.div
        variants={cardAnimation}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="w-full md:w-1/2"
      >
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
            {icon}
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
          
          <div className="border-t border-gray-100 pt-6">
            <h4 className="font-semibold text-gray-800 mb-4">Journalist Use Cases:</h4>
            <ul className="space-y-3">
              {useCases.map((useCase, i) => (
                <li key={i} className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{useCase}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        variants={contentAnimation}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="w-full md:w-1/2"
      >
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">How it helps journalists:</h4>
          <p className="text-gray-600 leading-relaxed">
            {description} This feature is specifically designed to help journalists work faster and more accurately, 
            ensuring they can focus on crafting compelling stories rather than getting bogged down in research and drafting.
          </p>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-green-800 text-sm font-medium">
              💡 <strong>Pro Tip:</strong> Use this feature to quickly generate multiple angles for breaking news stories.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const FeaturesSlider = () => {
  const features = [
    { 
      title: "AI Story Generation", 
      description: "Generate multiple story angles in seconds with verified facts and proper citations.", 
      icon: <FaPenFancy className="text-3xl" /> 
    },
    { 
      title: "Document Analysis", 
      description: "Upload PDFs and get instant summaries, key points, and fact verification.", 
      icon: <FaUpload className="text-3xl" /> 
    },
    { 
      title: "AI Research Assistant", 
      description: "Chat with AI to research topics, verify facts, and brainstorm ideas.", 
      icon: <FaComments className="text-3xl" /> 
    },
    { 
      title: "Performance Analytics", 
      description: "Track your content performance and get improvement suggestions.", 
      icon: <FaChartLine className="text-3xl" /> 
    },
    { 
      title: "Smart Search", 
      description: "Find relevant information across all your documents instantly.", 
      icon: <FaSearch className="text-3xl" /> 
    },
    { 
      title: "Content Recommendations", 
      description: "Get AI-powered suggestions to improve your writing and engagement.", 
      icon: <FaLightbulb className="text-3xl" /> 
    },
  ];

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-12 bg-gray-50 rounded-2xl mb-16"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h3 className="text-3xl font-bold text-center text-gray-800 mb-8">
          All Features at a Glance
        </h3>
        
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
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
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }}
          className="pb-12"
        >
          {features.map((feature, index) => (
            <SwiperSlide key={index}>
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl p-6 shadow-md border border-gray-100 text-center h-full flex flex-col"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600 mx-auto">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">{feature.title}</h4>
                <p className="text-gray-600 text-sm flex-grow">{feature.description}</p>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons */}
        <div className="flex justify-center mt-4 space-x-4">
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
      </div>
    </motion.section>
  );
};

const FeaturesPage = () => {
  const mainFeatures = [
    {
      title: "AI Story Generation",
      description: "Generate compelling stories with multiple angles in seconds. Our AI understands context and creates structured, citation-rich content perfect for journalism.",
      useCases: [
        "Break news faster with AI-assisted drafting",
        "Generate multiple perspectives on complex topics",
        "Overcome writer's block with creative prompts",
        "Create structured articles with verified facts"
      ],
      icon: <FaPenFancy className="text-3xl" />,
      isReversed: false
    },
    {
      title: "Document Intelligence",
      description: "Upload PDFs, reports, and documents to extract key information, summarize content, and verify facts automatically.",
      useCases: [
        "Quickly analyze government reports and policy documents",
        "Extract key statistics and quotes from research papers",
        "Verify facts across multiple uploaded sources",
        "Generate executive summaries for complex documents"
      ],
      icon: <FaUpload className="text-3xl" />,
      isReversed: true
    },
    {
      title: "AI Research Assistant",
      description: "Chat with our AI to research topics, fact-check information, and develop story ideas through natural conversation.",
      useCases: [
        "Research background information for investigative pieces",
        "Fact-check claims and verify data in real-time",
        "Brainstorm interview questions and story approaches",
        "Get explanations for complex policy topics"
      ],
      icon: <FaComments className="text-3xl" />,
      isReversed: false
    }
  ];

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            AI Tools for <span className="text-green-600">Modern Journalists</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Streamline your reporting workflow with powerful AI features designed specifically for journalists. 
            Create better stories faster with intelligent assistance.
          </p>
        </motion.header>

        {/* Main Features with Alternating Layout */}
        <section className="mb-16">
          {mainFeatures.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              useCases={feature.useCases}
              icon={feature.icon}
              index={index}
              isReversed={feature.isReversed}
            />
          ))}
        </section>

        {/* Features Slider */}
        <FeaturesSlider />

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-green-500 rounded-2xl p-12 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Journalism?</h2>
          <p className="text-green-50 text-xl mb-8 max-w-2xl mx-auto">
            Join journalists who are already creating better stories faster with AI assistance.
          </p>
          <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg">
            Start Creating Today
          </button>
        </motion.section>
      </main>
      <Footer />
    </>
  );
};

export default FeaturesPage;