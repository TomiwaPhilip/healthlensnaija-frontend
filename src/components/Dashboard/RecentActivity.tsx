import React, { useState, useEffect, useRef } from "react";
import {
  FaBook,
  FaComments,
  FaTimes,
  FaClock,
  FaExternalLinkAlt,
  FaInfoCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not logged in");

      const response = await fetch(`${API_URL}/recent-activity`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch recent activity");

      const data = await response.json();
      setActivities(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleView = (activity, e) => {
    e.stopPropagation();
    setSelectedActivity(activity);
  };

  const closeModal = () => {
    setSelectedActivity(null);
  };

  const handleNavigate = (activity) => {
    switch (activity.type) {
      case "story":
      case "opensearch-story":
        navigate(`/generate-story?id=${activity.id}`);
        break;
      case "chat":
        navigate(`/ai-chat?chatId=${activity.id}`);
        break;
      default:
        console.warn("Unknown activity type:", activity.type);
        break;
    }
  };

  if (loading) {
    return (
      <div
        ref={containerRef}
        className="flex justify-center items-center p-4 md:p-8"
      >
        <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-[#8CC43D]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        ref={containerRef}
        className="bg-red-50 border-l-4 border-red-500 p-3 md:p-4 my-4 md:my-6"
      >
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="bg-white p-3 sm:p-4 md:p-6 rounded-xl shadow-lg mt-4 md:mt-6 border border-gray-100 w-full"
    >
      <div className="flex justify-between items-center mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
          Recent Activity
        </h2>
        <span className="text-xs text-gray-500">
          {activities.length} items
        </span>
      </div>

      {/* FIXED: Responsive scroll container */}
      <div className="overflow-y-auto max-h-[50vh] sm:max-h-[60vh] md:max-h-[70vh] -mr-2 pr-2">
        {activities.length === 0 ? (
          <div className="text-center py-6 sm:py-8 md:py-12">
            <div className="text-gray-400 mb-2 sm:mb-3 md:mb-4">
              <FaBook className="inline-block text-2xl sm:text-3xl md:text-4xl" />
            </div>
            <p className="text-gray-500 text-sm sm:text-base">
              No recent activity found
            </p>
          </div>
        ) : (
          <ul className="space-y-2 sm:space-y-3">
            {activities.map((activity) => (
              <li
                key={activity.id}
                className="group flex flex-col bg-white p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border border-gray-200 hover:bg-[#8CC43D]/10 hover:border-[#8CC43D]/30 cursor-pointer transition-all duration-200"
                onClick={() => handleNavigate(activity)}
              >
                <div className="flex items-start gap-2 sm:gap-3 md:gap-4 w-full">
                  {/* Icon */}
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg flex-shrink-0 flex items-center justify-center ${
                      activity.type === "story" ||
                      activity.type === "opensearch-story"
                        ? "bg-[#8CC43D]/10"
                        : "bg-[#8CC43D]/10"
                    }`}
                  >
                    {activity.type === "story" ||
                    activity.type === "opensearch-story" ? (
                      <FaBook className="text-[#8CC43D] text-sm sm:text-base md:text-lg" />
                    ) : (
                      <FaComments className="text-[#8CC43D] text-sm sm:text-base md:text-lg" />
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 mb-1 truncate">
                      {activity.title}
                    </p>
                    <p className="font-semibold text-gray-800 text-sm whitespace-pre-wrap break-words line-clamp-2">
                      {activity.description}
                    </p>
                    <div className="flex items-center mt-1 sm:mt-2 text-xs text-gray-400">
                      <FaClock className="mr-1 text-[10px]" />
                      {new Date(activity.date).toLocaleString()}
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <button
                    onClick={(e) => handleView(activity, e)}
                    className="text-[#8CC43D] hover:text-[#6EA82D] p-1 sm:p-2 rounded-md hover:bg-[#8CC43D]/20 transition-colors flex-shrink-0"
                    title="View details"
                  >
                    <span className="sm:hidden">
                      <FaInfoCircle className="text-sm" />
                    </span>
                    <span className="hidden sm:inline text-xs md:text-sm">
                      Details
                    </span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* FIXED: Responsive Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-full sm:max-w-2xl mx-auto max-h-[90vh] overflow-y-auto relative m-2 sm:m-4">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 sm:top-3 sm:right-3 text-gray-400 hover:text-gray-600 transition-colors p-1 z-10 bg-white rounded-full"
            >
              <FaTimes className="text-lg sm:text-xl" />
            </button>

            {/* Modal Content */}
            <div className="p-3 sm:p-4 md:p-6">
              <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4 md:mb-6">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg flex-shrink-0 flex items-center justify-center ${
                    selectedActivity.type === "story" ||
                    selectedActivity.type === "opensearch-story"
                      ? "bg-[#8CC43D]/10"
                      : "bg-[#8CC43D]/10"
                  }`}
                >
                  {selectedActivity.type === "story" ||
                  selectedActivity.type === "opensearch-story" ? (
                    <FaBook className="text-[#8CC43D] text-lg sm:text-xl md:text-2xl" />
                  ) : (
                    <FaComments className="text-[#8CC43D] text-lg sm:text-xl md:text-2xl" />
                  )}
                </div>
                <div className="flex-1 min-w-0 mr-6"> {/* Added mr-6 for close button space */}
                  <h2 className="text-base sm:text-lg md:text-2xl font-bold text-gray-800 break-words">
                    {selectedActivity.title}
                  </h2>
                  <div className="flex items-center text-xs sm:text-sm text-gray-500 mt-1">
                    <FaClock className="mr-1" />
                    {new Date(selectedActivity.date).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-3 sm:p-4 md:p-5 rounded-lg mb-3 sm:mb-4 md:mb-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Description
                </h3>
                <p className="text-gray-800 text-sm sm:text-base whitespace-pre-wrap break-words">
                  {selectedActivity.description}
                </p>

                {selectedActivity.content && (
                  <>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-3 sm:mt-4 mb-2">
                      Content Preview
                    </h3>
                    <div className="bg-white p-2 sm:p-3 rounded border border-gray-200">
                      <p className="text-gray-600 text-sm sm:text-base whitespace-pre-wrap break-words line-clamp-4 md:line-clamp-6">
                        {selectedActivity.content}
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
                <button
                  onClick={closeModal}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors text-sm sm:text-base"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    closeModal();
                    handleNavigate(selectedActivity);
                  }}
                  className="px-3 py-2 rounded-lg bg-[#8CC43D] text-white hover:bg-[#7BB32D] transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <FaExternalLinkAlt className="text-xs sm:text-sm" />
                  Open Full Activity
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;