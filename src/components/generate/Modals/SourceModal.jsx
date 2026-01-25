import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiExternalLink, FiLoader } from "react-icons/fi";

const SourceModal = ({ isOpen, onClose, source, isNightMode, storyTitle }) => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (!isOpen || !source?._id) return;

    const fetchSummary = async () => {
      try {
        setLoading(true);
        const API_URL = import.meta.env.VITE_API_URL;
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${API_URL}/documents/${source._id}?storyTitle=${encodeURIComponent(storyTitle || "")}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        const data = await res.json();

        setSummary(data.summary || "(No summary generated)");
        setRelated(data.related || []);
      } catch (err) {
        console.error("❌ Error loading summary:", err);
        setSummary("(Preview unavailable)");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [isOpen, source, storyTitle]);

  if (!source) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className={`max-w-3xl w-full mx-4 rounded-xl shadow-xl p-6 overflow-y-auto max-h-[85vh] ${
              isNightMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
            }`}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                {source.title}
                {source.url && (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-500 hover:text-green-600 flex items-center gap-1 text-sm"
                  >
                    <FiExternalLink className="inline h-4 w-4" /> Open
                  </a>
                )}
              </h3>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            {loading ? (
              <div className="flex justify-center py-10">
                <FiLoader className="animate-spin text-gray-400 h-6 w-6" />
              </div>
            ) : (
              <>
                <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed">
                  {summary ? (
                    <p>{summary}</p>
                  ) : (
                    <div className="text-center text-gray-400">
                      (No preview available)
                    </div>
                  )}
                </div>

                {related?.length > 0 && (
                  <div className="mt-6 border-t border-gray-300 dark:border-gray-700 pt-4">
                    <h4 className="text-sm font-semibold mb-2">
                      Related Documents
                    </h4>
                    <ul className="space-y-1 text-sm">
                      {related.map((r) => (
                        <li key={r._id} className="text-green-600 dark:text-green-400 cursor-pointer hover:underline">
                          {r.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SourceModal;
