import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPaperPlane, FaMapMarkerAlt, FaPhone, FaEnvelope, FaUser, FaCheckCircle } from "react-icons/fa";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);

  // Animation variants matching your design system
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

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => setStatus(null), 3000);
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative min-h-screen py-16 md:py-24 lg:py-32 px-4 overflow-hidden flex flex-col items-center justify-center"
    >
      {/* Subtle background animations matching your design system */}
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

      <div className="relative max-w-6xl mx-auto w-full">
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6 text-gray-900"
            whilehover={{ scale: 1.02 }}
          >
            Contact Us
          </motion.h1>
          <motion.div 
            className="h-1 w-20 bg-green-500 mx-auto mb-4"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          />
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Have questions, feedback, or want to collaborate? We'd love to hear from you. 
            Get in touch with the Nigeria Health Watch team.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <motion.div variants={itemVariants} className="w-full">
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                whilehover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="relative">
                  <FaUser className="absolute left-4 top-4 text-gray-400" />
                  <input 
                    name="name"
                    type="text" 
                    placeholder="Your Name" 
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 p-4 pl-12 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white shadow-sm"
                  />
                </div>
              </motion.div>
              
              <motion.div
                whilehover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-4 text-gray-400" />
                  <input 
                    name="email"
                    type="email" 
                    placeholder="Your Email" 
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 p-4 pl-12 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white shadow-sm"
                  />
                </div>
              </motion.div>
              
              <motion.div
                whilehover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <textarea 
                  name="message"
                  placeholder="Your Message" 
                  rows="5" 
                  value={form.message}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 p-4 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white shadow-sm resize-vertical"
                ></textarea>
              </motion.div>
              
              <motion.button 
                type="submit"
                disabled={status === "sending"}
                className="group relative w-full inline-flex items-center justify-center px-8 py-4 overflow-hidden font-medium text-white bg-green-500 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                variants={buttonVariants}
                whilehover={status !== "sending" ? "hover" : {}}
                whiletap="tap"
              >
                <span className="relative z-10 flex items-center">
                  {status === "sending" ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <FaPaperPlane className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
                <span className="absolute inset-0 bg-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </motion.button>

              {/* Status Messages */}
              <AnimatePresence>
                {status === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700"
                  >
                    <FaCheckCircle className="text-green-500 text-xl" />
                    <span className="font-medium">Message sent successfully!</span>
                  </motion.div>
                )}

                {status === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
                  >
                    <div className="text-red-500 text-xl">⚠️</div>
                    <span className="font-medium">Something went wrong. Please try again.</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div variants={itemVariants} className="space-y-6">
            <motion.div
              whilehover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
              transition={{ type: "spring", stiffness: 300 }}
              className="p-6 bg-white rounded-xl shadow-md border border-gray-100"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <FaMapMarkerAlt className="text-2xl text-green-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Office</h3>
                  <p className="text-gray-600">
                    123 Health Avenue<br />
                    Central Business District<br />
                    Abuja, Nigeria
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whilehover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
              transition={{ type: "spring", stiffness: 300 }}
              className="p-6 bg-white rounded-xl shadow-md border border-gray-100"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <FaPhone className="text-2xl text-green-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Phone</h3>
                  <p className="text-gray-600">+234 (0) 123 456 7890</p>
                  <p className="text-gray-600">+234 (0) 987 654 3210</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whilehover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
              transition={{ type: "spring", stiffness: 300 }}
              className="p-6 bg-white rounded-xl shadow-md border border-gray-100"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <FaEnvelope className="text-2xl text-purple-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Email</h3>
                  <p className="text-gray-600">info@nigeriahealthwatch.com</p>
                  <p className="text-gray-600">contact@nigeriahealthwatch.com</p>
                </div>
              </div>
            </motion.div>

            {/* Operating Hours */}
            <motion.div
              whilehover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
              transition={{ type: "spring", stiffness: 300 }}
              className="p-6 bg-white rounded-xl shadow-md border border-gray-100"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Operating Hours</h3>
              <div className="space-y-2 text-gray-600">
                <div className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span className="font-medium">8:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday:</span>
                  <span className="font-medium">9:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday:</span>
                  <span className="font-medium">Closed</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default Contact;