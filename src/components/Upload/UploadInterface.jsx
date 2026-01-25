// components/Upload/UploadInterface.jsx
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUpload, FiFile, FiX, FiZap, FiArrowLeft } from "react-icons/fi";
import { message } from "antd";

const UploadInterface = ({
  isNightMode,
  onFileUpload,
  loading,
  onBack,
  embedded = false
}) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFileSelection(droppedFiles);
  };

  const handleFileSelection = (selectedFiles) => {
    const validPDFs = selectedFiles.filter(file => 
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
    );

    if (selectedFiles.length !== validPDFs.length) {
      message.error("Only PDF files are allowed");
      return;
    }

    setFiles([...files, ...validPDFs]);
  };

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    handleFileSelection(uploadedFiles);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const processFiles = () => {
    if (files.length === 0) {
      message.error("Please upload at least one PDF file");
      return;
    }
    onFileUpload(files);
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    hover: {
      y: -2,
      scale: 1.005,
      boxShadow: isNightMode
        ? "0 20px 40px -10px rgba(0, 0, 0, 0.4)"
        : "0 20px 40px -10px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <div className={`${embedded ? "" : "min-h-screen"} p-5 font-sans transition-colors duration-300 ${
      isNightMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"
    }`}>
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              isNightMode 
                ? "bg-gray-800 hover:bg-gray-700 text-gray-300" 
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            <FiArrowLeft className="h-4 w-4 mr-2" />
            Back to Chat
          </button>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-green-600 dark:text-green-400"
          >
            Upload PDF Files
          </motion.h1>
          
          <div className="w-24"></div> {/* Spacer for alignment */}
        </div>

        {/* File Upload Section */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          className={`p-8 rounded-2xl border-2 transition-all duration-300 ${
            isDragging ? "border-green-500" : "border-dashed"
          } ${
            isNightMode 
              ? `bg-gradient-to-br from-gray-800 to-gray-900 ${isDragging ? "border-green-400" : "border-gray-600"}` 
              : `bg-gradient-to-br from-white to-gray-50 ${isDragging ? "border-green-500" : "border-gray-300"}`
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center h-40">
            <motion.div 
              animate={{ y: isDragging ? -5 : 0 }}
              className={`h-16 mb-3 transition-transform duration-300 flex items-center justify-center ${
                isNightMode ? "filter invert opacity-90" : ""
              }`}
            >
              <FiUpload className="h-16 w-16 text-green-500" />
            </motion.div>
            
            <motion.label 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`cursor-pointer border rounded-lg px-4 py-2 flex items-center transition-all ${
                isNightMode 
                  ? "border-gray-600 hover:bg-gray-700 hover:border-gray-500" 
                  : "border-gray-300 hover:bg-gray-100 hover:border-gray-400"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileUpload}
                className="hidden"
                multiple
              />
              <FiUpload className={`h-5 w-5 mr-2 ${
                isNightMode ? "text-gray-300" : "text-gray-500"
              }`} />
              {isDragging ? "Drop your PDFs here" : "Select PDF files"}
            </motion.label>
            
            <p className={`mt-3 text-sm text-center ${
              isNightMode ? "text-gray-400" : "text-gray-500"
            }`}>
              Supported format: PDF only (Max 10MB per file)
            </p>
          </div>

          {/* Uploaded Files List */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6"
              >
                <h3 className={`font-semibold mb-3 ${
                  isNightMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  Selected Files ({files.length})
                </h3>
                
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <motion.li 
                      key={index} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        isNightMode ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center">
                        <FiFile className="h-5 w-5 mr-2 text-green-500" />
                        <span className={`${isNightMode ? "text-gray-200" : "text-gray-700"}`}>
                          {file.name} 
                          <span className={`text-sm ml-2 ${
                            isNightMode ? "text-gray-400" : "text-gray-500"
                          }`}>
                            ({Math.round(file.size / 1024)} KB)
                          </span>
                        </span>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeFile(index)}
                        className={`p-1 rounded-full ${
                          isNightMode 
                            ? "hover:bg-gray-600 text-gray-400" 
                            : "hover:bg-gray-200 text-gray-500"
                        }`}
                      >
                        <FiX className="h-4 w-4" />
                      </motion.button>
                    </motion.li>
                  ))}
                </ul>

                {/* Process Button */}
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={processFiles}
                  disabled={loading}
                  className={`mt-6 px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center w-full ${
                    loading 
                      ? "bg-green-400 cursor-not-allowed" 
                      : `${
                          isNightMode 
                            ? "bg-green-700 hover:bg-green-600" 
                            : "bg-green-600 hover:bg-green-700"
                        } hover:shadow-md`
                  } text-white`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiZap className="w-5 h-5 mr-2" />
                      Process {files.length > 1 ? `${files.length} Files` : 'File'}
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty State */}
          {files.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 text-center"
            >
              <p className={`text-sm ${isNightMode ? "text-gray-400" : "text-gray-500"}`}>
                No files selected. Upload PDFs to analyze their content and generate insights.
              </p>
              
              {/* Quick Tips */}
              <div className={`mt-6 p-4 rounded-lg ${
                isNightMode ? "bg-gray-800" : "bg-gray-100"
              }`}>
                <h4 className={`font-semibold mb-2 ${
                  isNightMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  What you can do with uploaded PDFs:
                </h4>
                <ul className={`text-sm space-y-1 ${
                  isNightMode ? "text-gray-400" : "text-gray-600"
                }`}>
                  <li>• Extract key insights and summaries</li>
                  <li>• Generate story angles and policy analysis</li>
                  <li>• Chat with the AI about the document content</li>
                  <li>• Get recommendations based on the uploaded data</li>
                </ul>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Loading Overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 flex flex-col items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="w-full max-w-md bg-gray-800 rounded-xl p-6 shadow-xl"
              >
                <h3 className="text-xl font-semibold text-white mb-4">Processing your PDFs</h3>
                
                <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
                  <motion.div 
                    className="bg-green-500 h-2.5 rounded-full transition-all duration-300" 
                    initial={{ width: "0%" }}
                    animate={{ width: "70%" }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                </div>
                
                <div className="text-white text-center mb-2">
                  Analyzing document content and generating insights...
                </div>
                
                <div className="text-gray-400 text-sm text-center">
                  This may take a few moments
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UploadInterface;