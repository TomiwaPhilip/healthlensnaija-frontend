// src/pages/dashboard/uploadData.jsx

import React, { useState, useRef, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

import { 
  FiUpload, 
  FiFile, 
  FiTrash2, 
  FiDownload, 
  FiEdit, 
  FiCopy, 
  FiMessageCircle,
  FiClock,
  FiZap,
  FiTag,
  FiChevronDown,
  FiChevronUp,
  FiExternalLink,
  FiBook,
  FiX
} from "react-icons/fi";
import { DashboardContext } from "../../context/DashboardContext";
import uploadIcon from "../../assets/image-upload.png";
import { formatStoryContent } from "../../utils/formatStoryContent";
import { message } from "antd";

const storyCache = {};

const UploadData = ({ embedded = false }) => {

  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const fileInputRef = useRef(null);
  const { isNightMode } = useContext(DashboardContext);
  const [processedData, setProcessedData] = useState(null);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentError, setDocumentError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);
  const [loadingFullStory, setLoadingFullStory] = useState(false);

  // Animation for processing progress
  // useEffect(() => {
  //   let interval;
  //   if (isProcessing) {
  //     interval = setInterval(() => {
  //       setProcessingProgress(prev => {
  //         if (prev >= 90) return 90;
  //         return prev + Math.floor(Math.random() * 10) + 5;
  //       });
  //     }, 500);
  //   } else {
  //     setProcessingProgress(0);
  //   }
  //   return () => clearInterval(interval);
  // }, [isProcessing]);

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
    handleFileUpload({ target: { files: droppedFiles } });
  };

  const handleDocumentClick = async (docId) => {
    try {
      setDocumentError(null);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not logged in");
  
      // Collapse if clicking the same document
      if (selectedDocument && selectedDocument._id === docId) {
        setSelectedDocument(null);
        return;
      }
  
      // 🔹 Get the document from local state first
      const localDoc = uploadedDocuments.find((d) => d._id === docId);
  
      // 🔹 If cached full story exists, show instantly
      if (storyCache[docId]) {
        setSelectedDocument({
          ...localDoc,
          story: storyCache[docId],
          loadingStory: false,
        });
        return;
      }
  
      // 🔹 Otherwise, show instant preview while fetching full story in background
      const previewStory =
        localDoc?.storyPreview?.preview ||
        localDoc?.content_summary ||
        "No summary available yet.";
  
      // Display preview instantly
      setSelectedDocument({
        ...localDoc,
        story: { content: previewStory },
        loadingStory: false, // show immediately
      });
  
      // Fetch the full story quietly in background
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/upload/documents/${docId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.ok) throw new Error("Failed to fetch document details");
      const data = await response.json();
  
      const storyData = data.story?.content
        ? data.story
        : { content: data.story || "" };
  
      // Cache story for next time
      if (storyData.content && storyData.content.length > 0) {
        storyCache[docId] = storyData;
      }
  
      // Only update if same document still selected (avoids flicker)
      setSelectedDocument((current) =>
        current && current._id === docId
          ? { ...data.document, story: storyData, loadingStory: false }
          : current
      );
    } catch (error) {
      console.error("Document fetch error:", error);
      setDocumentError(error.message);
      setSelectedDocument(null);
    }
  };
  

  const handleDeleteDocument = async (docId) => {
    try {
      const token = localStorage.getItem("token");
      const API_URL = import.meta.env.VITE_API_URL;
      await fetch(`${API_URL}/upload/documents/${docId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Remove from UI
      setUploadedDocuments(uploadedDocuments.filter(doc => doc._id !== docId));
      
      // If the deleted document was selected, clear the selection
      if (selectedDocument && selectedDocument._id === docId) {
        setSelectedDocument(null);
      }
      
      setShowDeleteConfirm(false);
      setDocToDelete(null);
      message.success("Document deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      setDocumentError("Failed to delete document");
    }
  };

  const confirmDelete = (docId, e) => {
    if (e) e.stopPropagation();
    setDocToDelete(docId);
    setShowDeleteConfirm(true);
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
    hover: { scale: 1.15, y: -2 },
    tap: { scale: 0.9 }
  };

  const ErrorMessage = ({ message }) => (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mt-4 p-4 rounded-lg border ${
        isNightMode 
          ? "bg-red-900/20 text-red-200 border-red-800" 
          : "bg-red-50 text-red-700 border-red-200"
      }`}
    >
      <div className="flex items-start">
        <svg className="h-5 w-5 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="font-semibold">Error occurred</p>
          <p>{message}</p>
        </div>
      </div>
    </motion.div>
  );

  const SuccessMessage = ({ message }) => (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mt-4 p-4 rounded-lg border ${
        isNightMode 
          ? "bg-green-900/20 text-green-200 border-green-800" 
          : "bg-green-50 text-green-700 border-green-200"
      }`}
    >
      <div className="flex items-start">
        <svg className="h-5 w-5 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="font-semibold">Success!</p>
          <p>{message}</p>
        </div>
      </div>
    </motion.div>
  );

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    const validPDFs = uploadedFiles.filter(file => 
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
    );

    if (uploadedFiles.length !== validPDFs.length) {
      setDocumentError("Only PDF files are allowed");
      return;
    }

    setFiles([...files, ...validPDFs]);
    setDocumentError(null);
  };

//  const processPDF = async () => {
//   if (files.length === 0) {
//     setDocumentError("Please upload a PDF file");
//     return;
//   }

//   setIsProcessing(true);
//   setProcessingProgress(0);

//   try {
//     const formData = new FormData();
//     formData.append("pdf", files[0]);

//     const API_URL = import.meta.env.VITE_API_URL;
//     const token = localStorage.getItem("token");

//     // 🔹 Upload with real progress tracking
//     const response = await axios.post(`${API_URL}/upload/process-pdf`, formData, {
//       headers: { Authorization: `Bearer ${token}` },
//       onUploadProgress: (event) => {
//         if (event.total) {
//           const percent = Math.round((event.loaded * 100) / event.total);
//           setProcessingProgress(percent * 0.4); // 0–40% for upload
//         }
//       },
//     });

//     // 🔹 Once upload finishes, show a “processing” phase
//     setProcessingProgress(50);

//     // Wait for server response (processing PDF)
//     const data = response.data;

//     if (!response.status || response.status >= 400) {
//       throw new Error(data.message || "Upload failed");
//     }

//     // 🔹 Simulate processing stages based on backend activity
//     let step = 50;
//     const stages = [
//       "Extracting text content...",
//       "Analyzing document structure...",
//       "Generating story angle..."
//     ];
//     for (let i = 0; i < stages.length; i++) {
//       setProcessingProgress(step += 15);
//       await new Promise((r) => setTimeout(r, 400));
//     }

//     setProcessingProgress(100);

//     setTimeout(() => {
//       setProcessedData({
//         story: data.story,
//         documentId: data.savedDocumentId,
//         storyId: data.storyId,
//         quickInsights: data.quickInsights,
//         sources: data.sources,
//         tags: data.tags || [],
//       });
//       setIsProcessing(false);
//       message.success("✅ PDF processed successfully!");
//     }, 300);

//     fetchUploadedDocuments();
//   } catch (error) {
//     console.error("Processing error:", error);
//     setDocumentError(error.message || "Failed to process PDF");
//     setIsProcessing(false);
//   }
// };


// Fetch uploaded documents from API

const processPDF = async () => {
  if (files.length === 0) {
    setDocumentError("Please upload a PDF file");
    return;
  }

  setIsProcessing(true);
  setProcessingProgress(0);

  try {
    const formData = new FormData();
    formData.append("pdf", files[0]);

    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("token");

    // ✅ Real upload progress tracking (0–40%)
    const response = await axios.post(`${API_URL}/upload/process-pdf`, formData, {
      headers: { Authorization: `Bearer ${token}` },
      onUploadProgress: (event) => {
        if (event.total) {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProcessingProgress(Math.min(percent * 0.4, 40)); // cap at 40%
        }
      },
    });

    // Move into processing phase
    setProcessingProgress(50);

    // ✅ Wait for backend to respond with results
    const data = response.data;

    if (!response.status || response.status >= 400) {
      const msg = data?.message || "Upload failed";
      throw new Error(msg);
    }

    // ✅ Simulate backend-side progress (for UX feedback)
    let currentStep = 50;
    const steps = [
      { msg: "Extracting text content...", delay: 400 },
      { msg: "Analyzing document structure...", delay: 400 },
      { msg: "Generating story angle...", delay: 400 },
    ];

    for (const step of steps) {
      setProcessingProgress((prev) => Math.min(prev + 15, 95));
      await new Promise((resolve) => setTimeout(resolve, step.delay));
    }

    // ✅ Finalize
    setProcessingProgress(100);

    setTimeout(() => {
      setProcessedData({
        story: data.story,
        documentId: data.savedDocumentId,
        storyId: data.storyId,
        quickInsights: data.quickInsights,
        sources: data.sources,
        tags: data.tags || [],
      });
      setIsProcessing(false);
      message.success("✅ PDF processed successfully!");
    }, 300);

    // Refresh the uploaded documents list silently
    fetchUploadedDocuments();
  } catch (error) {
    console.error("Processing error:", error);
    setDocumentError(error.message || "Failed to process PDF");
    setIsProcessing(false);
  }
};


const fetchUploadedDocuments = async (showLoader = true) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not logged in");

    const API_URL = import.meta.env.VITE_API_URL;
    const response = await fetch(`${API_URL}/upload/documents`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to fetch uploaded documents");

    const data = await response.json();

    // Update state + cache fresh copy
    setUploadedDocuments(data.documents);
    localStorage.setItem("uploadedDocsCache", JSON.stringify(data.documents));

  } catch (error) {
    console.error("Failed to fetch uploaded documents:", error);
    setDocumentError(error.message);
  }
};

// On mount: show cached instantly, then refresh in background
useEffect(() => {
  const cached = localStorage.getItem("uploadedDocsCache");
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      setUploadedDocuments(parsed);
    } catch (err) {
      console.warn("Invalid cached data, clearing:", err);
      localStorage.removeItem("uploadedDocsCache");
    }
  }

  // Always fetch fresh data silently (no flicker)
  fetchUploadedDocuments(false);
}, []);


  return (
<div className={`${embedded ? "" : "min-h-screen"} p-5 font-sans transition-colors duration-300 ${

      isNightMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"
    }`}>
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-6 text-green-600 dark:text-green-400"
        >
          PDF Story Generator
        </motion.h1>

        {documentError && <ErrorMessage message={documentError} />}
        {processedData && <SuccessMessage message="Your story has been successfully generated!" />}

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`p-6 rounded-xl shadow-lg max-w-md w-full ${
                  isNightMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
                <p className="mb-6">Are you sure you want to delete this document? This action cannot be undone.</p>
                <div className="flex justify-end space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDeleteConfirm(false)}
                    className={`px-4 py-2 rounded-lg ${
                      isNightMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeleteDocument(docToDelete)}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                  >
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Overlay */}
        <AnimatePresence>
          {isProcessing && (
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
                <h3 className="text-xl font-semibold text-white mb-4">Processing your PDF</h3>
                
                <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
                  <motion.div 
                    className="bg-green-500 h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${processingProgress}%` }}
                  />
                </div>
                
                <div className="text-white text-center mb-2">
  {processingProgress < 40 && "Uploading your PDF..."}
  {processingProgress >= 40 && processingProgress < 60 && "Extracting and cleaning text..."}
  {processingProgress >= 60 && processingProgress < 80 && "Analyzing document for context..."}
  {processingProgress >= 80 && processingProgress < 100 && "Generating story insights..."}
  {processingProgress >= 100 && "Finishing up..."}
</div>

                
                <div className="text-gray-400 text-sm text-center">
                  {Math.min(processingProgress, 100)}% complete
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
            <motion.img 
              src={uploadIcon} 
              alt="Upload" 
              animate={{ y: isDragging ? -5 : 0 }}
              className={`h-16 mb-3 transition-transform duration-300 ${
                isNightMode ? "filter invert opacity-90" : ""
              }`} 
            />
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
              {isDragging ? "Drop your PDF here" : "Select or drag PDF files"}
            </motion.label>
            <p className={`mt-3 text-sm ${
              isNightMode ? "text-gray-400" : "text-gray-500"
            }`}>
              Supported format: PDF only (Max 10MB)
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
                <h3 className="font-semibold mb-3">Selected Files:</h3>
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
                          {file.name} ({Math.round(file.size / 1024)} KB)
                        </span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setFiles(files.filter((_, i) => i !== index))}
                        className="p-1 rounded-full hover:bg-gray-600 hover:bg-opacity-30"
                      >
                        <FiX className="h-4 w-4" />
                      </motion.button>
                    </motion.li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={processPDF}
                  disabled={isProcessing}
                  className={`mt-6 px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center w-full ${
                    isProcessing 
                      ? "bg-green-400 cursor-not-allowed" 
                      : `${
                          isNightMode 
                            ? "bg-green-700 hover:bg-green-600" 
                            : "bg-green-600 hover:bg-green-700"
                        } hover:shadow-md`
                  } text-white`}
                >
                  {isProcessing ? (
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
                      Generate Story Structure
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Processed Data Display */}
          <AnimatePresence>
            {processedData && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8"
              >
                <div className={`p-6 rounded-2xl shadow-lg transition-all ${
                  isNightMode ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700" : "bg-white border border-gray-200"
                }`}>
                  <h2 className="text-2xl font-bold mb-6 text-center text-green-600 dark:text-green-400">
                    Your Generated Story Angle
                  </h2>

                  {/* Story Content */}
                  {processedData?.story && (
                    <div className={`p-4 rounded-lg ${
                      isNightMode ? "bg-gray-700/50" : "bg-gray-50"
                    }`}>
                      <div
                        className={`prose prose-sm max-w-none ${
                          isNightMode ? "prose-invert text-gray-300" : "text-gray-700"
                        } prose-headings:text-green-700 dark:prose-headings:text-green-400 prose-a:text-green-600 dark:prose-a:text-green-400`}
                        dangerouslySetInnerHTML={{
                          __html: formatStoryContent(
                            typeof processedData.story === "string"
                              ? processedData.story
                              : processedData.story.content
                          )
                        }}
                      />
                    </div>
                  )}

                  {/* Quick Insights */}
                  {processedData.quickInsights && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2 flex items-center">
                        <FiZap className="mr-2" />
                        Key Insights
                      </h3>
                      <div className={`p-4 rounded-lg border ${
                        isNightMode ? "bg-green-900/20 border-green-700/50" : "bg-green-50 border-green-200"
                      }`}>
                        <ul className="space-y-2 text-sm">
                          {Array.isArray(processedData.quickInsights)
                            ? processedData.quickInsights.map((line, idx) => (
                                <motion.li 
                                  key={idx} 
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.1 }}
                                  className="flex items-start"
                                >
                                  <span className="text-green-500 mr-2 mt-1">•</span>
                                  <span className={isNightMode ? "text-gray-300" : "text-gray-700"}>
                                    {line}
                                  </span>
                                </motion.li>
                              ))
                            : processedData.quickInsights.split("\n").map((line, idx) => (
                                <motion.li 
                                  key={idx} 
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.1 }}
                                  className="flex items-start"
                                >
                                  <span className="text-green-500 mr-2 mt-1">•</span>
                                  <span className={isNightMode ? "text-gray-300" : "text-gray-700"}>
                                    {line}
                                  </span>
                                </motion.li>
                              ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Sources */}
                  {processedData.sources?.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2 flex items-center">
                        <FiBook className="mr-2" />
                        Sources
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {processedData.sources.map((src) => (
                          <motion.a
                            key={src.id}
                            whileHover={{ y: -2, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            href={src.type === "external" ? src.link : `http://localhost:5173${src.link}`}
                            target={src.type === "external" ? "_blank" : "_self"}
                            rel="noopener noreferrer"
                            className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                              isNightMode
                                ? "bg-gray-700 border-gray-600 hover:border-green-500/50 hover:bg-gray-600/50"
                                : "bg-white border-gray-200 hover:border-green-400 hover:bg-green-50/50"
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <p className="font-medium text-sm">{src.title}</p>
                              {src.type === "external" && (
                                <FiExternalLink className="h-3 w-3 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5 ml-2" />
                              )}
                            </div>
                            <p className="text-xs text-gray-500 truncate mt-1">{src.link}</p>
                          </motion.a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => navigate(`/dashboard?docId=${processedData.documentId}`)}
                      className={`p-2.5 rounded-lg transition-all duration-200 ${
                        isNightMode
                          ? "bg-green-600 hover:bg-green-500 shadow-lg shadow-green-500/25"
                          : "bg-green-500 hover:bg-green-400 shadow-lg shadow-green-500/40"
                      } text-white`}
                      title="Open Story Builder"
                    >
                      <FiMessageCircle className="h-4 w-4" />
                    </motion.button>

                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => {
                        const blob = new Blob(
                          [typeof processedData.story === "string"
                            ? processedData.story
                            : processedData.story?.content || ""],
                          { type: "text/plain" }
                        );
                        const link = document.createElement("a");
                        link.href = URL.createObjectURL(blob);
                        link.download = `story-${processedData.documentId}.txt`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        message.success("✅ Story exported successfully!");
                      }}
                      className={`p-2.5 rounded-lg transition-all duration-200 border ${
                        isNightMode
                          ? "bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-green-500 text-gray-300 hover:text-green-300"
                          : "bg-white border-gray-300 hover:border-green-400 hover:bg-green-50 text-gray-700 hover:text-green-700"
                      }`}
                      title="Export Story"
                    >
                      <FiDownload className="h-4 w-4" />
                    </motion.button>

                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => navigate(`/story-editor?storyId=${processedData.storyId}`)}
                      className={`p-2.5 rounded-lg transition-all duration-200 border ${
                        isNightMode
                          ? "bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-yellow-500 text-gray-300 hover:text-yellow-300"
                          : "bg-white border-gray-300 hover:border-yellow-400 hover:bg-yellow-50 text-gray-700 hover:text-yellow-700"
                      }`}
                      title="Edit Story"
                    >
                      <FiEdit className="h-4 w-4" />
                    </motion.button>

                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => {
                        const content = typeof processedData.story === "string"
                          ? processedData.story
                          : processedData.story?.content || "";
                        navigator.clipboard.writeText(content);
                        message.success("Story copied to clipboard!");
                      }}
                      className={`p-2.5 rounded-lg transition-all duration-200 border ${
                        isNightMode
                          ? "bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-green-500 text-gray-300 hover:text-green-300"
                          : "bg-white border-gray-300 hover:border-green-400 hover:bg-green-50 text-gray-700 hover:text-green-700"
                      }`}
                      title="Copy Story"
                    >
                      <FiCopy className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
<AnimatePresence>
  {uploadedDocuments.length === 0 && !documentError && (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="text-gray-500 text-sm animate-pulse mt-10 text-center"
    >
      Loading your uploaded stories…
    </motion.p>
  )}
</AnimatePresence>

          {/* Uploaded Documents List */}
          {uploadedDocuments.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-12"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center text-green-600 dark:text-green-400">
                <FiFile className="w-6 h-6 mr-2" />
                My Uploaded Files
              </h2>
              <div className="space-y-4">
                {uploadedDocuments.map((doc) => (
                  <motion.div
                    key={doc._id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    className={`border rounded-2xl transition-all overflow-hidden ${
                      isNightMode 
                        ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-green-500/30" 
                        : "bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-green-400/50"
                    } ${selectedDocument && selectedDocument._id === doc._id ? "border-green-500 border-2" : ""}`}
                  >
                    <div 
                      className="p-4 cursor-pointer flex justify-between items-center"
                      onClick={() => handleDocumentClick(doc._id)}
                    >
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg mr-3 ${
                          isNightMode ? "bg-gray-700" : "bg-gray-100"
                        }`}>
                          <FiFile className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{doc.title}</h3>
                          <p className={`text-sm mt-1 flex items-center ${
                            isNightMode ? "text-gray-400" : "text-gray-500"
                          }`}>
                            <FiClock className="h-3 w-3 mr-1" />
                            Uploaded: {new Date(doc.metadata.upload_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => confirmDelete(doc._id, e)}
                          className={`p-2 rounded-full mr-2 ${
                            isNightMode 
                              ? "hover:bg-gray-700 text-gray-400 hover:text-red-400" 
                              : "hover:bg-gray-100 text-gray-500 hover:text-red-500"
                          }`}
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </motion.button>
                        {selectedDocument && selectedDocument._id === doc._id ? (
                          <FiChevronUp className="h-5 w-5 text-green-600" />
                        ) : (
                          <FiChevronDown className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                    </div>
                    
                    {/* Document details that expand when selected */}
                    <AnimatePresence>
                      {selectedDocument && selectedDocument._id === doc._id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className={`p-4 border-t ${
                            isNightMode ? "border-gray-700 bg-gray-750" : "border-gray-200 bg-gray-50"
                          }`}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="font-semibold text-green-700">Upload Date:</p>
                              <p>{new Date(selectedDocument.metadata.upload_date).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-green-700">File Size:</p>
                              <p>{selectedDocument.metadata.size}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-green-700">Primary Pillar:</p>
                              <p>{selectedDocument.pillar}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-green-700">Keywords:</p>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {selectedDocument.keywords.map((keyword, i) => (
                                  <motion.span
                                    key={i}
                                    whileHover={{ scale: 1.05 }}
                                    className={`px-2 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${
                                      isNightMode
                                        ? "bg-gray-700 border-gray-600 text-gray-300 hover:bg-green-900/40 hover:border-green-500 hover:text-green-300"
                                        : "bg-white border-gray-300 text-gray-700 hover:bg-green-100 hover:border-green-400 hover:text-green-800"
                                    }`}
                                  >
                                    {keyword}
                                  </motion.span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {selectedDocument.loadingStory && (
                            <p className="mt-3 text-sm text-gray-400 animate-pulse">
                              Loading story details…
                            </p>
                          )}

                          {/* Generated Story or Summary */}
                          {selectedDocument.story ? (
                            <div className="mt-6">
                              <h3 className="text-lg font-semibold text-green-700 mb-2">Generated Story</h3>
                              <div className={`p-4 rounded-lg ${
                                isNightMode ? "bg-gray-700/50" : "bg-gray-50"
                              }`}>
                                <div
                                  className={`prose prose-sm max-w-none ${
                                    isNightMode ? "prose-invert text-gray-300" : "text-gray-700"
                                  } prose-headings:text-green-700 dark:prose-headings:text-green-400 prose-a:text-green-600 dark:prose-a:text-green-400`}
                                  dangerouslySetInnerHTML={{
                                    __html: formatStoryContent(
                                      typeof selectedDocument.story === "string"
                                        ? selectedDocument.story
                                        : selectedDocument.story.content
                                    ),
                                  }}
                                />
                              </div>

                              {selectedDocument.story.quickInsights && (
                                <div className="mt-4">
                                  <h4 className="font-semibold text-green-700 mb-1">Key Insights</h4>
                                  <ul className="space-y-1 text-sm">
                                    {(Array.isArray(selectedDocument.story.quickInsights)
                                      ? selectedDocument.story.quickInsights
                                      : selectedDocument.story.quickInsights.split("\n")
                                    ).map((line, idx) => (
                                      <li key={idx} className="flex items-start">
                                        <span className="text-green-500 mr-2 mt-1">•</span>
                                        <span>{line}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="mt-4">
                              <h3 className="text-lg font-semibold text-green-700 mb-2">Summary</h3>
                              <p className={`${isNightMode ? "text-gray-300" : "text-gray-600"}`}>
                                {selectedDocument.content_summary}
                              </p>
                            </div>
                          )}

                          {/* Story Actions */}
                          <div className="mt-6 flex flex-wrap items-center gap-3">
                            <motion.button
                              variants={buttonVariants}
                              whileHover="hover"
                              whileTap="tap"
                              onClick={() => navigate(`/dashboard?docId=${selectedDocument._id}`)}
                              className={`p-2.5 rounded-lg transition-all duration-200 ${
                                isNightMode
                                  ? "bg-green-600 hover:bg-green-500 shadow-lg shadow-green-500/25"
                                  : "bg-green-500 hover:bg-green-400 shadow-lg shadow-green-500/40"
                              } text-white`}
                              title="Open Story Builder"
                            >
                              <FiMessageCircle className="h-4 w-4" />
                            </motion.button>

                            <motion.button
                              variants={buttonVariants}
                              whileHover="hover"
                              whileTap="tap"
                              onClick={() => {
                                const blob = new Blob(
                                  [typeof selectedDocument.story === "string"
                                    ? selectedDocument.story
                                    : selectedDocument.story?.content || ""],
                                  { type: "text/plain" }
                                );
                                const link = document.createElement("a");
                                link.href = URL.createObjectURL(blob);
                                link.download = `${selectedDocument.title || "story"}.txt`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                message.success("✅ Story exported successfully!");
                              }}
                              className={`p-2.5 rounded-lg transition-all duration-200 border ${
                                isNightMode
                                  ? "bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-green-500 text-gray-300 hover:text-green-300"
                                  : "bg-white border-gray-300 hover:border-green-400 hover:bg-green-50 text-gray-700 hover:text-green-700"
                              }`}
                              title="Export Story"
                            >
                              <FiDownload className="h-4 w-4" />
                            </motion.button>

                            <motion.button
                              variants={buttonVariants}
                              whileHover="hover"
                              whileTap="tap"
                              onClick={() => navigate(`/story-editor?storyId=${selectedDocument.linkedStoryId}`)}
                              className={`p-2.5 rounded-lg transition-all duration-200 border ${
                                isNightMode
                                  ? "bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-yellow-500 text-gray-300 hover:text-yellow-300"
                                  : "bg-white border-gray-300 hover:border-yellow-400 hover:bg-yellow-50 text-gray-700 hover:text-yellow-700"
                              }`}
                              title="Edit Story"
                            >
                              <FiEdit className="h-4 w-4" />
                            </motion.button>

                            <motion.button
                              variants={buttonVariants}
                              whileHover="hover"
                              whileTap="tap"
                              onClick={() => {
                                const content = typeof selectedDocument.story === "string"
                                  ? selectedDocument.story
                                  : selectedDocument.story?.content || selectedDocument.content_summary || "";
                                navigator.clipboard.writeText(content);
                                message.success("Story copied to clipboard!");
                              }}
                              className={`p-2.5 rounded-lg transition-all duration-200 border ${
                                isNightMode
                                  ? "bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-green-500 text-gray-300 hover:text-green-300"
                                  : "bg-white border-gray-300 hover:border-green-400 hover:bg-green-50 text-gray-700 hover:text-green-700"
                              }`}
                              title="Copy Story"
                            >
                              <FiCopy className="h-4 w-4" />
                            </motion.button>

                            <motion.button
                              variants={buttonVariants}
                              whileHover="hover"
                              whileTap="tap"
                              onClick={() => confirmDelete(selectedDocument._id)}
                              className={`p-2.5 rounded-lg transition-all duration-200 border ${
                                isNightMode
                                  ? "bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-red-500 text-gray-300 hover:text-red-300"
                                  : "bg-white border-gray-300 hover:border-red-400 hover:bg-red-50 text-gray-700 hover:text-red-700"
                              }`}
                              title="Delete Document"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setFiles([]);
                    setProcessedData(null);
                    setDocumentError(null);
                  }}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    isNightMode 
                      ? "bg-green-700 hover:bg-green-600" 
                      : "bg-green-600 hover:bg-green-700"
                  } text-white hover:shadow-md`}
                >
                  <FiUpload className="w-5 h-5 mr-2 inline" />
                  Upload Another File
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default UploadData;