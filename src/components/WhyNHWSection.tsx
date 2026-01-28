import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlay, FaTimes } from "react-icons/fa";
import ReactPlayer from "react-player/lazy";

const WhyNHWSection = () => {
  const features = [
    { title: "Efficiency at its Best", description: "Save hours of work with AI tools that streamline your workflow." },
    { title: "Customizable Solutions", description: "Adapt our features to your unique storytelling and data analysis needs." },
    { title: "User-friendly Design", description: "Navigate easily with an intuitive interface built for everyone." },
    { title: "Reliable Support", description: "Get expert help whenever you need it, ensuring smooth experiences." },
    { title: "Innovation Technology", description: "Stay ahead with AI that evolves with your needs." },
  ];

  const [showModal, setShowModal] = useState(false);
  const videoRef = useRef(null);
  const [videoHeight, setVideoHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (videoRef.current) {
        setVideoHeight(videoRef.current.offsetHeight);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="py-10 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
      <h2 className="text-4xl font-bold text-gray-800">
  Why{" "}
  <span className="bg-clip-text text-transparent bg-green-500">
  Healthlens Naija
  </span>{" "}
  Stands Out
</h2>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-16">
        {/* Video Block */}
        <div className="lg:w-1/2 relative">
          <div 
            className="relative overflow-hidden shadow-2xl rounded-xl cursor-pointer bg-gradient-to-br from-gray-300 to-gray-400"
            style={{ paddingBottom: '56.25%' }} 
            onClick={() => setShowModal(true)}
            ref={videoRef}
          >
            <motion.div
              className="absolute inset-0 bg-white/20 backdrop-blur-md flex items-center justify-center"
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <FaPlay className="text-white text-4xl" />
            </motion.div>
          </div>
        </div>

        {/* Feature List Block */}
        <div className="lg:w-1/2 flex flex-col">
        <div style={{ height: videoHeight || 'auto' }} className="overflow-y-auto pr-2 hide-scrollbar">
            <ul className="space-y-6">
              {features.map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
                >
                  <div className="flex-shrink-0 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
                    <p className="mt-2 text-gray-600">{feature.description}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-md" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative w-full max-w-4xl z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute -top-10 right-0 text-white hover:text-gray-200 transition-colors"
                onClick={() => setShowModal(false)}
              >
                <FaTimes className="text-2xl" />
              </button>
              <div className="relative" style={{ paddingBottom: "56.25%" }}>
                <ReactPlayer
                  url="https://youtu.be/xlROWz1W7dI?si=hXd9Fy3VvzQIQ5Hk"
                  width="100%"
                  height="100%"
                  className="absolute top-0 left-0"
                  playing={showModal}
                  controls={true}
                  config={{
                    youtube: { playerVars: { modestbranding: 1, rel: 0, showinfo: 0 } },
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default WhyNHWSection;
