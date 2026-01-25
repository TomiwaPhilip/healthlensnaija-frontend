// src/components/admin/UserUploadsTab.jsx
import React, { useState, useEffect } from "react";
import axios from "../../utils/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import { FiEye, FiCheck, FiTrash2, FiX } from "react-icons/fi";
import { toast } from "react-toastify";

const API_BASE = import.meta.env.VITE_API_URL;

export default function UserUploadsTab() {
  const [uploads, setUploads] = useState([]);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  const showSuccess = (msg) => toast.success(msg, { theme: "colored" });
  const showError = (msg) => toast.error(msg, { theme: "colored" });

  // fetch uploads
  const fetchUploads = async () => {
    try {
      const res = await axios.get(`${API_BASE}/pending-docs`);
      setUploads(res.data || []);
    } catch (err) {
      showError("Failed to fetch user uploads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await axios.patch(`${API_BASE}/pending-docs/${id}/approve`);
      showSuccess(res.data.message);
      setUploads((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      showError(err.response?.data?.message || "Failed to approve");
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.delete(`${API_BASE}/pending-docs/${id}`);
      setUploads((prev) => prev.filter((u) => u._id !== id));
      showSuccess("Upload deleted");
    } catch (err) {
      showError("Failed to delete upload");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">Loading uploads...</div>
    );
  }

  return (
    <div className="space-y-4">
      {uploads.length === 0 ? (
        <div className="bg-gray-50 p-6 rounded-xl text-center text-gray-500">
          No user uploads pending review.
        </div>
      ) : (
        uploads.map((u) => (
          <motion.div
            key={u._id}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex justify-between items-start"
          >
            <div>
              <h4 className="font-semibold text-[#30B349]">{u.title}</h4>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {u.content_summary || "No summary available."}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Uploaded: {new Date(u.metadata.upload_date).toLocaleString()}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setPreview(u)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-[#30B349]"
              >
                <FiEye />
              </button>
              <button
                onClick={() => handleApprove(u._id)}
                className="p-2 rounded-full hover:bg-gray-100 text-green-600"
              >
                <FiCheck />
              </button>
              <button
                onClick={() => handleReject(u._id)}
                className="p-2 rounded-full hover:bg-gray-100 text-red-600"
              >
                <FiTrash2 />
              </button>
            </div>
          </motion.div>
        ))
      )}

      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-3xl w-full p-6 relative"
            >
              <button
                onClick={() => setPreview(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>

              <h3 className="text-lg font-bold text-[#30B349] mb-3">
                {preview.title}
              </h3>
              <p className="text-gray-600 mb-2">
                <strong>Summary:</strong> {preview.content_summary}
              </p>
              <div className="border-t pt-3 text-sm text-gray-700 max-h-[50vh] overflow-y-auto whitespace-pre-wrap">
                {preview.full_content?.slice(0, 4000) || "No content."}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
