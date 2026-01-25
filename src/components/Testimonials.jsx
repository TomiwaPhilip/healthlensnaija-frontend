import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaQuoteLeft } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(`${API_URL}/testimonials`);
        const data = await res.json();
        setTestimonials(data);
      } catch (error) {
        console.error("❌ Failed to load testimonials:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, when: "beforeChildren" },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 10 },
    },
    hover: {
      y: -10,
      boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
  };

  const starVariants = {
    hover: { scale: 1.2, transition: { type: "spring", stiffness: 500 } },
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500 text-lg">
        Loading testimonials...
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className="py-20 text-center text-gray-500 text-lg">
        No testimonials available yet.
      </div>
    );
  }

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <motion.h2
            className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-green-500"
            whileHover={{ scale: 1.02 }}
          >
            Hear What Our Users Are Saying
          </motion.h2>

          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Trusted by health professionals and organizations nationwide
          </motion.p>
          <motion.div
            className="h-1 w-20 bg-green-500 mx-auto mt-6"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial._id || index}
              variants={itemVariants}
              whileHover="hover"
              className="p-8 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col"
            >
              <div className="flex-grow">
                <FaQuoteLeft className="text-3xl text-gray-200 mb-4" />
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  {testimonial.review}
                </p>
              </div>

              <div className="flex items-center mt-auto">
                <motion.img
                  src={
                    testimonial.image ||
                    "https://ui-avatars.com/api/?name=" +
                      encodeURIComponent(testimonial.name)
                  }
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full mr-4 object-cover"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {testimonial.name}
                  </h3>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  <div className="flex mt-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <motion.svg
                        key={i}
                        variants={starVariants}
                        whileHover="hover"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 ${
                          i < testimonial.rating
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.911c.969 0 1.371 1.24.588 1.81l-3.975 2.888a1 1 0 00-.364 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118L10 14.347l-3.975 2.888c-.785.57-1.84-.197-1.54-1.118l1.518-4.674a1 1 0 00-.364-1.118L1.664 9.1c-.783-.57-.381-1.81.588-1.81h4.911a1 1 0 00.95-.69L9.049 2.927z" />
                      </motion.svg>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default Testimonials;

