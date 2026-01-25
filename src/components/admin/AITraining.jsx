//src/components/admin/AITraining.jsx
import React, { useState, useEffect } from "react";
import axios from "../../utils/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FiUpload,
  FiFileText,
  FiTrash2,
  FiEye,
  FiX,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { FaTrain } from "react-icons/fa";
import pillars from "../../../shared/constants/pillars.json";
const API_BASE = import.meta.env.VITE_API_URL;
import UserUploadsTab from "./UserUploadsTab";

export { pillars };

export default function AITraining({ documents, setDocuments }) {
  const [uploading, setUploading] = useState(false);
  const [showTextUpload, setShowTextUpload] = useState(false);
  const [textDocTitle, setTextDocTitle] = useState("");
  const [textDocContent, setTextDocContent] = useState("");
  const [trainingStatus, setTrainingStatus] = useState("");
  const [previewQueue, setPreviewQueue] = useState([]);
  const [currentPreview, setCurrentPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progressMap, setProgressMap] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslation("aiTrainingPage");
  const [showMetadataModal, setShowMetadataModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [selectedPillar, setSelectedPillar] = useState("");
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  // const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [activeTab, setActiveTab] = useState("training");
  const openMetadataModal = (doc) => {
    setSelectedDoc(doc);
    setSelectedPillar(doc.pillar || "");
  
    if (doc.pillar && (!doc.keywords || doc.keywords.length === 0)) {
      // Auto-fill all keywords for this pillar
      setSelectedKeywords(pillars[doc.pillar] || []);
    } else {
      setSelectedKeywords(doc.keywords || []);
    }
  
    setShowMetadataModal(true);
  };
  

// const handleDeleteAll = async () => {
//   try {
//     await axios.delete("/training"); // ✅ hits DELETE /api/training
//     setDocuments([]); // clear state
//     setShowDeleteAllModal(false);
//     showSuccess("All documents deleted");
//   } catch (err) {
//     showError("Failed to delete all documents", {
//       error: err.response?.data?.message || err.message,
//     });
//   }
// };


  
  // Calculate pagination values
  const totalPages = Math.ceil(documents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDocuments = documents.slice(startIndex, startIndex + itemsPerPage);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // --- Upload handler ---
  const uploadFile = async (file) => {
    if (!file) return;
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      setUploading(true);
  
      const res = await axios.post(`${API_BASE}/training/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setProgressMap((prev) => ({ ...prev, [file.name]: percent }));
        },
      });
      
      // cleanup progress after success
      setProgressMap((prev) => {
        const next = { ...prev };
        delete next[file.name];
        return next;
      });
  
      // ✅ Add as pending document
      setDocuments((prev) => [{ ...res.data, status: "pending" }, ...prev]);
  
      showSuccess("toast.uploaded", { title: res.data.title });
      handlePreviewDoc(res.data._id);
    } catch (err) {
      console.error("Upload error:", err);
      showError("toast.uploadFailed", {
        error: err.response?.data?.message || err.message,
      });
    } finally {
      // 👇 always reset
      setUploading(false);
    }
  };
  

  const handleSkipAllPreviews = () => {
    setPreviewQueue([]);     // clear the queue
    setCurrentPreview(null); // close the modal
  };

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await axios.get(`${API_BASE}/training`);

        setDocuments(res.data);
      } catch (err) {
        showError("aiTrainingPage.toast.fetchFailed");
      }
    };
  
    fetchDocs();
  
    // OPTIONAL: refresh every 15s if you want live updates
    const interval = setInterval(fetchDocs, 15000);
  
    return () => clearInterval(interval); // cleanup
  }, []); // ✅ empty array, not [setDocuments]
  

  // Toast helpers
  const showSuccess = (key, options = {}) =>
        toast.success(t(key, options), { theme: "colored" });
      const showError = (key, options = {}) =>
        toast.error(t(key, options), { theme: "colored" });
  const uploadFiles = async (files) => {
    for (let file of files) {
      await uploadFile(file);
    }
  };

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFiles(Array.from(e.dataTransfer.files));
      e.dataTransfer.clearData();
    }
  };

  // Save text doc
  const handleSaveTextDoc = async () => {
    if (!textDocTitle || !textDocContent) {
      showError("aiTrainingPage.toast.missingFields");
      return;
    }
    try {
      const res = await axios.post(`${API_BASE}/admin-dashboard/documents/text`, {
        title: textDocTitle,
        full_content: textDocContent,
      });
      setDocuments([res.data, ...documents]);
      setShowTextUpload(false);
      setTextDocTitle("");
      setTextDocContent("");
      showSuccess("aiTrainingPage.toast.textSaved");
    } catch (err) {
      showError("aiTrainingPage.toast.textSaveFailed", {
                error: err.response?.data?.message || err.message,
              });
    }
  };

  // Delete document
  const handleDeleteDoc = async (docId) => {
    try {
      await axios.delete(`${API_BASE}/training/${docId}`);

      setDocuments((prev) => prev.filter((d) => d._id !== docId));
      showSuccess("aiTrainingPage.toast.deleted");
    } catch (err) {
      showError("aiTrainingPage.toast.deleteFailed", {
               error: err.response?.data?.message || err.message,
              });
    }
  };

  // Train all documents
  const handleTrainAll = async () => {
    try {
      setTrainingStatus("Training all documents...");
      const res = await axios.post(`${API_BASE}/training/train-all`);
      setTrainingStatus(
        res.data.message + ` (Chunks: ${res.data.totalChunks})`
      );
      setDocuments((prev) =>
        prev.map((d) => ({ ...d, status: "trained", trainedAt: new Date() }))
      );
      showSuccess("aiTrainingPage.toast.trainedAll");
    } catch (err) {
      setTrainingStatus(
        "Training failed: " + (err.response?.data?.message || err.message)
      );
      showError("aiTrainingPage.toast.trainFailed", {
               error: err.response?.data?.message || err.message,
            });
    }
  };

  const handleSaveMetadata = async () => {
    try {
      const res = await axios.put(`${API_BASE}/training/${selectedDoc._id}/metadata`, {
        pillar: selectedPillar,
        keywords: selectedKeywords,
      });
      setDocuments((prev) =>
        prev.map((d) => (d._id === selectedDoc._id ? res.data : d))
      );
      setShowMetadataModal(false);
      showSuccess("Metadata updated");
    } catch (err) {
      showError("Failed to update metadata");
    }
  };
  

  // Preview document
  const handlePreviewDoc = async (docId) => {
    try {
      const res = await axios.get(`${API_BASE}/training/${docId}`);
      setPreviewQueue((prev) => [...prev, res.data]);
      if (!currentPreview) {
        setCurrentPreview(res.data); // auto-open first
      }
    } catch (err) {
      showError(
        "Could not load preview: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  const handleClosePreview = () => {
    setPreviewQueue((prev) => {
      const [, ...rest] = prev; // remove first
      setCurrentPreview(rest[0] || null);
      return rest;
    });
  };

  // Train single document
  const handleTrainOne = async (docId) => {
    try {
      setTrainingStatus(`Training document...`);
      const res = await axios.post(`${API_BASE}/training/${docId}/train`)
      setTrainingStatus(res.data.message);
      setDocuments((prev) =>
        prev.map((d) =>
          d._id === docId
            ? { ...d, status: "trained", trainedAt: new Date() }
            : d
        )
      );
      showSuccess("aiTrainingPage.toast.trainedOne");
    } catch (err) {
      setTrainingStatus(
        "Training failed: " + (err.response?.data?.message || err.message)
      );
      showError("aiTrainingPage.toast.trainFailed", {
                error: err.response?.data?.message || err.message,
              });
    }
  };

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 md:p-6"
    >
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="mb-6">
  <div className="flex items-center justify-between mb-3">
    <motion.h2
      className="text-xl sm:text-2xl font-bold text-[#30B349]"
      initial={{ x: -20 }}
      animate={{ x: 0 }}
    >
      {t("title")}
    </motion.h2>
    <div className="text-sm text-gray-500">
      {t("documentsCount", { count: documents.length })}
    </div>
  </div>

  {/* ✅ Tab Switcher */}
  <div className="flex gap-4 border-b border-gray-200">
    <button
      onClick={() => setActiveTab("training")}
      className={`pb-2 px-4 font-medium ${
        activeTab === "training"
          ? "text-[#30B349] border-b-2 border-[#30B349]"
          : "text-gray-500 hover:text-[#30B349]"
      }`}
    >
      Training Documents
    </button>
    <button
      onClick={() => setActiveTab("uploads")}
      className={`pb-2 px-4 font-medium ${
        activeTab === "uploads"
          ? "text-[#30B349] border-b-2 border-[#30B349]"
          : "text-gray-500 hover:text-[#30B349]"
      }`}
    >
      User Uploads
    </button>
  </div>
</div>
{/* ✅ Tab Content */}
{activeTab === "uploads" ? (
  <UserUploadsTab />
) : (
  <>


      {/* Mobile menu button */}
      <div className="lg:hidden mb-4">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-full p-3 bg-[#30B349] text-white rounded-lg flex items-center justify-center gap-2"
        >
          <span>{t("actionsMenu")}</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      {/* Action Cards */}
      <div className={`${isMobileMenuOpen ? 'grid' : 'hidden'} grid-cols-1 lg:grid lg:grid-cols-3 gap-4 mb-6`}>
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-md p-4 border border-[#8CC43D]/20 hover:border-[#8CC43D]/50 transition-all"
        >
          <h3 className="font-medium text-[#30B349] mb-2">{t("trainAllTitle")}</h3>
          <p className="text-sm text-gray-600 mb-3">{t("trainAllDesc")}</p>
          <button
            onClick={handleTrainAll}
            className="w-full bg-gradient-to-r from-[#30B349] to-[#8CC43D] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
          <FaTrain /> {t("trainAllButton")}
          </button>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-md p-4 border border-[#8CC43D]/20 hover:border-[#8CC43D]/50 transition-all"
        >
          <h3 className="font-medium text-[#30B349] mb-2">{t("uploadFileTitle")}</h3>
          <p className="text-sm text-gray-600 mb-3">{t("uploadFileDesc")}</p>
          <label className="w-full bg-white border border-[#30B349] text-[#30B349] px-4 py-2 rounded-lg hover:bg-[#30B349]/10 transition-colors flex items-center justify-center gap-2 cursor-pointer">
          <FiUpload /> {t("uploadFileButton")}
            <input
              type="file"
              multiple
              onChange={(e) => uploadFiles(Array.from(e.target.files))}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-md p-4 border border-[#8CC43D]/20 hover:border-[#8CC43D]/50 transition-all"
        >
          <h3 className="font-medium text-[#30B349] mb-2">{t("addTextTitle")}</h3>
          <p className="text-sm text-gray-600 mb-3">{t("addTextDesc")}</p>
          <button
            onClick={() => setShowTextUpload(true)}
            className="w-full bg-white border border-[#30B349] text-[#30B349] px-4 py-2 rounded-lg hover:bg-[#30B349]/10 transition-colors flex items-center justify-center gap-2"
          >
          <FiFileText /> {t("addTextButton")}
          </button>
        </motion.div>
      </div>

      {/* Drag and Drop Area */}
      <motion.div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-4 md:p-8 text-center mb-6 transition-colors ${
          isDragging ? "border-[#30B349] bg-[#8CC43D]/10" : "border-gray-300"
        }`}
      >
        <input
          type="file"
          id="fileInput"
          className="hidden"
          accept=".pdf,.docx,.txt"
          multiple
          onChange={(e) => uploadFiles(Array.from(e.target.files))}
          disabled={uploading}
        />

        <label htmlFor="fileInput" className="cursor-pointer block">
          <FiUpload className="mx-auto text-3xl text-[#30B349] mb-2" />
          <p className="text-gray-600">
          {isDragging ? t("dragDropActive") : t("dragDropIdle")}
          </p>
          <p className="text-sm text-gray-400 mt-1">{t("supportedFormats")}</p>
        </label>

        {Object.entries(progressMap).map(([fileName, percent]) => (
          <div key={fileName} className="mt-2">
            <p className="text-sm text-gray-600">
              {fileName} - {percent}%
            </p>
            <div className="w-full bg-gray-200 rounded h-2 mt-1">
              <div
                className="bg-[#30B349] h-2 rounded"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        ))}
      </motion.div>

      {/* Training Status */}
      {trainingStatus && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#8CC43D]/10 border-l-4 border-[#30B349] p-3 rounded mb-6"
        >
          <p className="text-sm text-[#30B349] font-medium">{trainingStatus}</p>
        </motion.div>
      )}

      {/* Document List Header with Pagination Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
      <h3 className="font-medium text-lg text-gray-800">
          {t("trainingDocuments")}
        </h3>
        
        <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">{t("show")}:</label>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="border rounded-md px-2 py-1 text-sm"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      {/* Document List */}
      <motion.div variants={itemVariants}>
        {documents.length > 0 ? (
          <>
            <div className="space-y-2">
              <AnimatePresence>
                {paginatedDocuments.map((doc) => (
                  <motion.div
                    key={doc._id}
                    layout
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={itemVariants}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 md:p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {doc.title}
                        </h4>
                        <div className="flex items-center mt-1">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              doc.status === "trained"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {doc.status === "trained" ? "Trained" : "Pending"}
                          </span>
                          {doc.trainedAt && (
                            <span className="text-xs text-gray-500 ml-2">
                              {new Date(doc.trainedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-1 md:space-x-2">
  <button
    onClick={() => handlePreviewDoc(doc._id)}
    className="p-1 md:p-2 text-gray-500 hover:text-[#30B349] rounded-full hover:bg-gray-100 transition-colors"
    title="Preview"
  >
    <FiEye size={16} />
  </button>

  {doc.status !== "trained" && (
    <button
      onClick={() => handleTrainOne(doc._id)}
      className="p-1 md:p-2 text-gray-500 hover:text-[#30B349] rounded-full hover:bg-gray-100 transition-colors"
      title="Train"
    >
      <FaTrain size={14} />
    </button>
  )}

  {/* 📝 NEW — Metadata Button */}
  <button
    onClick={() => openMetadataModal(doc)}
    className="p-1 md:p-2 text-gray-500 hover:text-green-500 rounded-full hover:bg-gray-100 transition-colors"
    title="Edit Metadata"
  >
    📝
  </button>

  <button
    onClick={() => handleDeleteDoc(doc._id)}
    className="p-1 md:p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100 transition-colors"
    title="Delete"
  >
    <FiTrash2 size={16} />
  </button>
</div>

                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <AnimatePresence>
  {showMetadataModal && (
    <motion.div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <motion.div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
        <h3 className="text-lg font-bold text-[#30B349] mb-4">
          Set Pillar & Keywords
        </h3>

        {/* Pillar Select */}
        <label className="block text-sm font-medium mb-1">Pillar</label>
        <select
  value={selectedPillar}
  onChange={(e) => {
    const newPillar = e.target.value;
    setSelectedPillar(newPillar);
    setSelectedKeywords(pillars[newPillar] || []); // ✅ auto-fill all
  }}
  className="w-full border rounded-md p-2 mb-4"
>
  <option value="">-- Select Pillar --</option>
  {Object.keys(pillars).map((pillar) => (
    <option key={pillar} value={pillar}>
      {pillar}
    </option>
  ))}
</select>


        {/* Keywords Multi-select */}
        {selectedPillar && (
          <div>
            <label className="block text-sm font-medium mb-1">Keywords</label>
            <div className="max-h-48 overflow-y-auto border rounded-md p-2 space-y-1">
            {pillars[selectedPillar].map((kw, idx) => (
  <label key={`${kw}-${idx}`} className="flex items-center gap-2 text-sm">
    <input
      type="checkbox"
      checked={selectedKeywords.includes(kw)}
      onChange={(e) => {
        if (e.target.checked) {
          setSelectedKeywords((prev) => [...prev, kw]);
        } else {
          setSelectedKeywords((prev) =>
            prev.filter((k) => k !== kw)
          );
        }
      }}
    />
    {kw}
  </label>
))}

            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => setShowMetadataModal(false)}
            className="px-4 py-2 border rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveMetadata}
            className="px-4 py-2 bg-[#30B349] text-white rounded-md hover:bg-[#2a9e40]"
          >
            Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>


            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, documents.length)} of {documents.length} documents
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    <FiChevronLeft size={16} />
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-8 h-8 rounded-md text-sm ${
                            currentPage === pageNum
                              ? "bg-[#30B349] text-white"
                              : "border hover:bg-gray-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <span className="px-2">...</span>
                    )}
                    
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        className="w-8 h-8 rounded-md border text-sm hover:bg-gray-100"
                      >
                        {totalPages}
                      </button>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    <FiChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-50 rounded-lg p-6 md:p-8 text-center"
          >
            <p className="text-gray-500">{t("noDocsTitle")}</p>
            <p className="text-sm text-gray-400 mt-1">{t("noDocsSubtitle")}</p>
          </motion.div>
        )}
      </motion.div>

      {/* Text Upload Modal */}
      <AnimatePresence>
        {showTextUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="bg-white rounded-xl shadow-xl w-full max-w-md"
            >
              <div className="p-4 md:p-6">
                <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-[#30B349]">                  
                {t("addTextModalTitle")}
               </h3>
                  <button
                    onClick={() => setShowTextUpload(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX size={20} />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("addTextModalFields.title")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("addTextModalFields.placeholderTitle")}
                      value={textDocTitle}
                      onChange={(e) => setTextDocTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#30B349] focus:border-transparent"
                    />
                  </div>
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     {t("addTextModalFields.content")}
                    </label>
                    <textarea
                      placeholder={t("addTextModalFields.placeholderContent")}
                      value={textDocContent}
                      onChange={(e) => setTextDocContent(e.target.value)}
                      className="w-full h-32 md:h-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#30B349] focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowTextUpload(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                  {t("cancel")}
                  </button>
                  <button
                    onClick={handleSaveTextDoc}
                    className="px-4 py-2 bg-[#30B349] text-white rounded-md hover:bg-[#2a9e40] transition-colors flex items-center gap-2"
                  >
                     <FiCheck /> {t("save")}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {currentPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl flex flex-col border border-[#30B349]/20 overflow-hidden"
              style={{
                position: 'fixed',
                right: '1rem',
                top: '1rem',
                bottom: '1rem',
                maxHeight: 'calc(100vh - 2rem)',
              }}
            >
              {/* Header */}
              <div className="p-4 bg-gradient-to-r from-[#30B349]/10 to-[#8CC43D]/10 border-b border-[#30B349]/20 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-[#30B349] flex items-center gap-2">
                    <FiFileText className="text-[#30B349]" />
                    {currentPreview.title}
                  </h3>
                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                    {currentPreview.status === "trained" ? (
                      <span className="flex items-center gap-1 text-green-600">
                      <FiCheck className="text-sm" /> {t("statusTrained")}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-yellow-600">
                      <FaTrain className="text-xs" /> {t("pendingTraining")}
                      </span>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={handleClosePreview}
                  className="p-1 rounded-full hover:bg-[#30B349]/10 text-gray-500 hover:text-[#30B349] transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 overflow-y-auto flex-1 bg-gray-50">
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-gray-700 bg-white p-4 rounded-lg border border-gray-200">
                  <div className="prose prose-sm max-w-none space-y-4">
  <p className="font-medium text-gray-800">Summary:</p>
  <p className="text-gray-700">{currentPreview.content_summary}</p>

  <p className="font-medium text-gray-800 mt-4">Full Content:</p>
  <pre className="whitespace-pre-wrap font-sans text-gray-700 bg-white p-3 rounded-lg border border-gray-200">
    {currentPreview.full_content?.slice(0, 2000) || "No content"}
  </pre>

  {currentPreview.tables?.length > 0 && (
    <div className="mt-4">
      <p className="font-medium text-gray-800">Extracted Tables:</p>
      <pre className="whitespace-pre-wrap font-sans text-gray-700 bg-white p-3 rounded-lg border border-gray-200">
        {JSON.stringify(currentPreview.tables[0], null, 2)}
      </pre>
    </div>
  )}
</div>

                  </pre>
                </div>
              </div>

              {/* Footer */}
              <div className="p-3 bg-white border-t border-gray-200 flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  {previewQueue.length > 0 && (
                    <span>{previewQueue.length} more in queue</span>
                  )}
                </div>
                
                <div className="flex gap-2">
  {currentPreview.status !== "trained" && (
    <button
      onClick={() => {
        handleTrainOne(currentPreview._id);
        handleClosePreview();
      }}
      className="px-3 py-1.5 bg-[#30B349] text-white rounded-lg hover:bg-[#2a9e40] transition-colors flex items-center gap-1 text-sm"
    >
      <FaTrain size={14} /> {t("trainNow")}
    </button>
  )}

  <button
    onClick={handleClosePreview}
    className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm flex items-center gap-1"
  >
    {previewQueue.length > 0 ? t("next") : t("close")}
  </button>

  {/* 🚀 NEW: Skip All */}
  {previewQueue.length > 1 && (
    <button
      onClick={handleSkipAllPreviews}
      className="px-3 py-1.5 border border-red-300 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-sm flex items-center gap-1"
    >
      Skip All
    </button>
  )}
</div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </>
)}

    </motion.section>
  );
}