import React from "react";
import moment from "moment";
import { toast } from "react-toastify";
import { FiCopy, FiExternalLink, FiArrowLeftCircle, FiArrowRightCircle, FiGlobe } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiDownload,
  FiMessageCircle,
  FiEdit,
  FiTrash2,
  FiClock,
  FiZap,
  FiTag,
  FiChevronDown,
  FiChevronUp,
  FiLink,
  FiBook
} from "react-icons/fi";
import { useTranslation } from "react-i18next";
// import StoryRecommendations from "./StoryRecommendations";
import SourceModal from "../Modals/SourceModal";

const StoryCard = ({
  story,
  isNightMode,
  handleExportStory,
  handleContinueDiscussion,
  handleChatClick, // 🆕 NEW: Add handleChatClick prop for chat items
  navigate,
  openDeleteModal,
  loadingRecs,
  recommendationsMap,
  formatStoryContent
}) => {
  const { t } = useTranslation("story");
  const recommendations = recommendationsMap?.[story._id] || [];

  const [expanded, setExpanded] = React.useState(() => {
    const createdTs = new Date(story?.createdAt).getTime();
    const now = Date.now();
    return Number.isFinite(createdTs) && now - createdTs < 15000;
  });

  const [showQuickInsights, setShowQuickInsights] = React.useState(false);
  const [activeAngleIndex, setActiveAngleIndex] = React.useState(() => story.selectedIndex || 0);

  const hasMultipleAngles = Array.isArray(story.angles) && story.angles.length > 1;
  const currentAngle = hasMultipleAngles ? story.angles[activeAngleIndex] : null;
  
  const [selectedSource, setSelectedSource] = React.useState(null);
  const [isSourceModalOpen, setIsSourceModalOpen] = React.useState(false);

  // 🆕 NEW: Check if this is a chat item
  const isChat = story.type === 'chat';

  React.useEffect(() => {
    // console.log("♻️ [StoryCard] Reset internal state for new story:", story._id);
    setExpanded(false);
    setActiveAngleIndex(story.selectedIndex || 0);
    setShowQuickInsights(false);
  }, [story._id]);

  const handleOpenSource = async (src) => {
    if (src.type === "external") {
      window.open(src.link, "_blank");
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_URL}${src.link}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setSelectedSource({ ...src, content: data.content_summary || data.full_content });
      setIsSourceModalOpen(true);
    } catch (err) {
      console.error("Failed to load source:", err);
      toast.error("Unable to load source content.");
    }
  };

  const handlePrevAngle = () => {
    setActiveAngleIndex((prev) =>
      prev > 0 ? prev - 1 : story.angles.length - 1
    );
  };
  
  const handleNextAngle = () => {
    setActiveAngleIndex((prev) =>
      prev < story.angles.length - 1 ? prev + 1 : 0
    );
  };

  // 🆕 NEW: Handle chat click
  const handleChatItemClick = () => {
    if (isChat && handleChatClick) {
      handleChatClick(story._id);
    }
  };
  
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

  const citationVariants = {
    initial: { scale: 1, backgroundColor: isNightMode ? "rgba(34, 197, 94, 0.2)" : "rgba(132, 204, 22, 0.2)" },
    hover: { 
      scale: 1.02, 
      backgroundColor: isNightMode ? "rgba(34, 197, 94, 0.4)" : "rgba(132, 204, 22, 0.4)",
      transition: { duration: 0.2 }
    }
  };

  const getDomainFromUrl = (url) => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch (e) {
      return url;
    }
  };

  return (
    <motion.div
      key={story._id + (story.updatedAt || story.createdAt)}
      id={`${isChat ? 'chat' : 'story'}-${story._id}`} // 🆕 UPDATED: Different ID for chats
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onClick={(e) => {
        // ✅ Prevent click if a button or link inside was clicked
        const tag = e.target.tagName.toLowerCase();
        const isButton = ["button", "svg", "path", "a"].includes(tag) || e.target.closest("button, a");
        
        if (!isButton) {
          if (isChat) {
            handleChatItemClick(); // 🆕 NEW: Handle chat click
          } else {
            setExpanded((prev) => !prev); // Existing story behavior
          }
        }
      }}
      className={`cursor-pointer mb-6 p-6 rounded-2xl shadow-lg transition-all duration-300 ${
        isNightMode
          ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-green-500/30"
          : "bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-green-400/50"
      } ${isChat ? 'border-l-4 border-l-green-500' : ''}`} // 🆕 NEW: green left border for chats
    >

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
        <div className="flex-1 space-y-2">
          {/* 🆕 NEW: Chat badge */}
          {isChat && (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-700 mb-2">
              💬 Chat
            </div>
          )}
          
          <h3 className={`text-xl font-bold leading-tight ${
            isNightMode ? "text-white" : "text-gray-900"
          }`}>
            {isChat ? story.name || 'Chat Conversation' : story.title} {/* 🆕 UPDATED: Use chat name */}
          </h3>

          {/* 🆕 UPDATED: Show chat preview or story content */}
          {isChat ? (
            <div className={`text-sm leading-relaxed ${
              isNightMode ? "text-gray-300" : "text-gray-600"
            }`}>
              {story.messages?.length > 0 
                ? `💬 ${story.messages.length} messages • Last: ${story.messages[story.messages.length - 1]?.text?.substring(0, 100)}...`
                : '💬 Start a conversation...'
              }
            </div>
          ) : (
            <>
              {story.userPrompt && (
                <div className={`mt-2 px-3 py-2 rounded-md text-sm border-l-4 ${
                  isNightMode
                    ? "bg-gray-800 border-green-500 text-gray-300"
                    : "bg-green-50 border-green-400 text-gray-700"
                }`}>
                  <span className="font-semibold mr-2">Prompt:</span>
                  {story.userPrompt}
                </div>
              )}

              <p className={`text-sm leading-relaxed ${
                isNightMode ? "text-gray-300" : "text-gray-600"
              }`}>
                {story.quickInsights
                  ? story.quickInsights.split("\n")[0]
                  : story.content
                    ? story.content.replace(/[#*_>\-\n]/g, "").slice(0, 200) + "..."
                    : "(No content yet — still enriching)"}
              </p>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isChat && story.solutionFocused && (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
              isNightMode
                ? "bg-green-900/40 text-green-300 border border-green-700/50"
                : "bg-green-100 text-green-800 border border-green-200"
            }`}>
              {t("card.solutionFocused")}
            </span>
          )}

          {/* 🆕 UPDATED: Only show expand button for stories */}
          {!isChat && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setExpanded(!expanded)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isNightMode
                  ? "bg-gray-700 hover:bg-gray-600 text-green-400"
                  : "bg-gray-100 hover:bg-gray-200 text-green-600"
              }`}
            >
              {expanded ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
            </motion.button>
          )}
        </div>
      </div>

      {/* Expandable Content - Only for Stories */}
      {!isChat && (
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden space-y-6"
            >
              {/* Main Story or Angle Viewer */}
              <div className="relative">
                {hasMultipleAngles && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 mb-2 sm:mb-0">
                      <FiZap className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="font-medium text-green-800 dark:text-green-300 text-sm">
                        Multiple Angles
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handlePrevAngle}
                        className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 border border-green-200 dark:border-green-700"
                        title="Previous angle"
                      >
                        <FiArrowLeftCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </motion.button>
                      <span className="text-xs font-medium text-green-700 dark:text-green-300 min-w-[50px] text-center">
                        {activeAngleIndex + 1} / {story.angles.length}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleNextAngle}
                        className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 border border-green-200 dark:border-green-700"
                        title="Next angle"
                      >
                        <FiArrowRightCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </motion.button>
                    </div>
                  </div>
                )}

                <div className={`p-4 rounded-lg ${
                  isNightMode ? "bg-gray-700/50" : "bg-gray-50"
                }`}>
                  {(() => {
                    const rawHtml = formatStoryContent(
                      currentAngle?.content || story.content || "(No content yet)"
                    );

                    // 🟩 Wrap anything inside square brackets with animated lime green highlight
                    const highlightedHtml = rawHtml.replace(
                      /\[([^\]]+)\]/g,
                      (_, inner) =>
                        `<span class="${
                          isNightMode
                            ? "bg-lime-500/20 text-lime-300 border border-lime-500/30 px-1.5 py-0.5 rounded-md transition-all duration-300 hover:bg-lime-500/30 hover:border-lime-400/50"
                            : "bg-lime-200 text-lime-800 border border-lime-300 px-1.5 py-0.5 rounded-md transition-all duration-300 hover:bg-lime-300 hover:border-lime-400"
                        }">[${inner}]</span>`
                    );

                    return (
                      <div
                        className={`prose prose-sm max-w-none ${
                          isNightMode ? "prose-invert text-gray-300" : "text-gray-700"
                        } prose-headings:text-green-700 dark:prose-headings:text-green-400 prose-a:text-green-600 dark:prose-a:text-green-400`}
                        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                      />
                    );
                  })()}
                </div>
              </div>

              {/* Sources */}
              {story.sources?.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-md ${
                      isNightMode ? "bg-green-900/40" : "bg-green-100"
                    }`}>
                      <FiBook className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <h4 className={`text-base font-semibold ${
                      isNightMode ? "text-gray-200" : "text-gray-800"
                    }`}>
                      {t("card.researchSources")}
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {story.sources
                      ?.filter((src) => !src.link?.includes("localhost"))
                      .map((src) => (
                      <motion.div
                        key={src.id}
                        onClick={() => handleOpenSource(src)}
                        whileHover={{ y: -2, scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 group ${
                          isNightMode
                            ? "bg-gray-700 border-gray-600 hover:border-green-500/50 hover:bg-gray-600/50"
                            : "bg-white border-gray-200 hover:border-green-400 hover:bg-green-50/50"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <span className={`font-medium text-sm leading-relaxed group-hover:text-green-700 dark:group-hover:text-green-300 ${
                            isNightMode ? "text-gray-200" : "text-gray-800"
                          }`}>
                            {src.title}
                          </span>
                          {src.type === "external" && (
                            <FiExternalLink className="h-3 w-3 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5 ml-2" />
                          )}
                        </div>
                        <div className="mt-2 flex items-center">
                          {src.link && !src.link.includes("localhost") && !src.link.startsWith("/documents") && (
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                              {src.source && src.source.toLowerCase() !== "seeded"
                                ? src.source
                                : getDomainFromUrl(src.link)}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Determ Media Mentions */}
              {story.determInsights && Array.isArray(story.determInsights?.mentions) && story.determInsights.mentions.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-md ${isNightMode ? "bg-green-900/40" : "bg-green-100"}`}>
                      <FiGlobe className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <h4
                      className={`text-base font-semibold ${
                        isNightMode ? "text-gray-200" : "text-gray-800"
                      }`}
                    >
                      Media Mentions (via Determ)
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {story.determInsights.mentions.slice(0, 6).map((mention, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ y: -2, scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => window.open(mention.url, "_blank")}
                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 group ${
                          isNightMode
                            ? "bg-gray-700 border-gray-600 hover:border-green-500/50 hover:bg-gray-600/50"
                            : "bg-white border-gray-200 hover:border-green-400 hover:bg-green-50/50"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <span
                            className={`font-medium text-sm leading-relaxed group-hover:text-green-700 dark:group-hover:text-green-300 ${
                              isNightMode ? "text-gray-200" : "text-gray-800"
                            }`}
                          >
                            {mention.title || "Untitled Mention"}
                          </span>
                          <FiExternalLink className="h-3 w-3 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5 ml-2" />
                        </div>
                        {mention.source && (
                          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            {mention.source} • {moment(mention.date).format("MMM D, YYYY")}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
              {story.determInsights && (!story.determInsights.mentions || story.determInsights.mentions.length === 0) && (
                <div className={`p-3 rounded-lg text-sm italic text-center ${
                  isNightMode ? "text-gray-400 bg-gray-800/30" : "text-gray-500 bg-gray-100/50"
                }`}>
                  No recent media mentions found.
                </div>
              )}

              {/* Quick Insights */}
              {story.quickInsights && (
                <div className="space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowQuickInsights(!showQuickInsights)}
                    className={`flex items-center justify-between w-full p-3 rounded-lg border transition-all duration-200 ${
                      showQuickInsights
                        ? isNightMode
                          ? "bg-green-900/30 border-green-600 text-green-300"
                          : "bg-green-100 border-green-400 text-green-800"
                        : isNightMode
                          ? "bg-green-900/20 border-green-700/50 text-green-400 hover:bg-green-900/30"
                          : "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-md ${
                        showQuickInsights 
                          ? "bg-green-500 text-white" 
                          : isNightMode 
                            ? "bg-green-800 text-green-300" 
                            : "bg-green-200 text-green-700"
                      }`}>
                        <FiZap className="h-4 w-4" />
                      </div>
                      <span className="font-semibold text-sm">{t("card.keyInsights")}</span>
                    </div>
                    {showQuickInsights ? <FiChevronUp className="h-4 w-4" /> : <FiChevronDown className="h-4 w-4" />}
                  </motion.button>

                  <AnimatePresence>
                    {showQuickInsights && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className={`p-4 rounded-lg border ${
                          isNightMode
                            ? "bg-green-900/20 border-green-700/50"
                            : "bg-green-50 border-green-200"
                        }`}>
                          <ul className="space-y-2 text-sm">
                            {story.quickInsights.split("\n").map((line, idx) => (
                              <motion.li
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-start"
                              >
                                <span className={`text-base mr-2 mt-0.5 ${
                                  isNightMode ? "text-green-400" : "text-green-600"
                                }`}>•</span>
                                <span className={`leading-relaxed ${
                                  isNightMode ? "text-gray-300" : "text-gray-700"
                                }`}>
                                  {line}
                                </span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Tags */}
              {(story.tags || []).length > 0 && (
                <div className="flex flex-wrap gap-2 items-center">
                  <div className={`p-1.5 rounded-md ${
                    isNightMode ? "bg-gray-700" : "bg-gray-100"
                  }`}>
                    <FiTag className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </div>
                  {(story.tags || []).map((tag, idx) => (
                    <motion.span
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${
                        isNightMode
                          ? "bg-gray-700 border-gray-600 text-gray-300 hover:bg-green-900/40 hover:border-green-500 hover:text-green-300"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-green-100 hover:border-green-400 hover:text-green-800"
                      }`}
                    >
                      {tag?.name || tag?.slug || tag}
                    </motion.span>
                  ))}
                </div>
              )}

              {/* Created */}
              <div className={`flex items-center gap-2 p-3 rounded-lg ${
                isNightMode ? "bg-gray-700/50" : "bg-gray-100"
              }`}>
                <div className={`p-1.5 rounded-md ${
                  isNightMode ? "bg-gray-600" : "bg-gray-200"
                }`}>
                  <FiClock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </div>
                <span className={`text-xs font-medium ${
                  isNightMode ? "text-gray-400" : "text-gray-600"
                }`}>
                  {t("card.created")}{" "}
                  {moment(story.createdAt).format("MMMM Do YYYY, h:mm A")}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Action Buttons - Different for Stories vs Chats */}
      <div className="flex flex-wrap gap-2 items-center mt-4">
        {isChat ? (
          // 🆕 NEW: Chat-specific actions
          <>
            {/* Open Chat - Primary Action */}
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleChatItemClick}
              className={`p-2.5 rounded-lg transition-all duration-200 ${
                isNightMode
                  ? "bg-green-600 hover:bg-green-500 shadow-lg shadow-green-500/25"
                  : "bg-green-500 hover:bg-green-400 shadow-lg shadow-green-500/40"
              } text-white`}
              title="Open Chat"
            >
              <FiMessageCircle className="h-4 w-4" />
            </motion.button>

            {/* View Chat Details */}
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleChatItemClick}
              className={`p-2.5 rounded-lg transition-all duration-200 border ${
                isNightMode
                  ? "bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-green-500 text-gray-300 hover:text-green-300"
                  : "bg-white border-gray-300 hover:border-green-400 hover:bg-green-50 text-gray-700 hover:text-green-700"
              }`}
              title="View Chat Details"
            >
              <FiExternalLink className="h-4 w-4" />
            </motion.button>
          </>
        ) : (
          // Story-specific actions (existing code)
          <>
            {/* Continue - Primary Action */}
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => handleContinueDiscussion(story)}
              className={`p-2.5 rounded-lg transition-all duration-200 ${
                isNightMode
                  ? "bg-green-600 hover:bg-green-500 shadow-lg shadow-green-500/25"
                  : "bg-green-500 hover:bg-green-400 shadow-lg shadow-green-500/40"
              } text-white`}
              title="Continue Discussion"
            >
              <FiMessageCircle className="h-4 w-4" />
            </motion.button>

            {/* Export */}
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => handleExportStory(story)}
              className={`p-2.5 rounded-lg transition-all duration-200 border ${
                isNightMode
                  ? "bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-green-500 text-gray-300 hover:text-green-300"
                  : "bg-white border-gray-300 hover:border-green-400 hover:bg-green-50 text-gray-700 hover:text-green-700"
              }`}
              title="Export Story"
            >
              <FiDownload className="h-4 w-4" />
            </motion.button>

            {/* Edit */}
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => navigate(`/story-editor?storyId=${story._id}`)}
              className={`p-2.5 rounded-lg transition-all duration-200 border ${
                isNightMode
                  ? "bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-yellow-500 text-gray-300 hover:text-yellow-300"
                  : "bg-white border-gray-300 hover:border-yellow-400 hover:bg-yellow-50 text-gray-700 hover:text-yellow-700"
              }`}
              title="Edit Story"
            >
              <FiEdit className="h-4 w-4" />
            </motion.button>

            {/* Copy */}
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => {
                navigator.clipboard.writeText(story.content);
                toast.success("✅ Story copied to clipboard!", {
                  position: "top-center",
                  autoClose: 1500,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: false,
                  draggable: false,
                  theme: isNightMode ? "dark" : "light",
                });
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

            {/* Delete */}
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => openDeleteModal(story._id)}
              className={`p-2.5 rounded-lg transition-all duration-200 border ${
                isNightMode
                  ? "bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-red-500 text-gray-300 hover:text-red-300"
                  : "bg-white border-gray-300 hover:border-red-400 hover:bg-red-50 text-gray-700 hover:text-red-700"
              }`}
              title="Delete Story"
            >
              <FiTrash2 className="h-4 w-4" />
            </motion.button>
          </>
        )}
      </div>

      <SourceModal
        isOpen={isSourceModalOpen}
        onClose={() => setIsSourceModalOpen(false)}
        source={selectedSource}
        isNightMode={isNightMode}
        storyTitle={story.title}
      />

      {/* Recommendations - Only for Stories */}
      {!isChat && (
        <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
          {/* <StoryRecommendations
            storyId={story._id}
            loading={loadingRecs?.[story._id]}
            recommendations={recommendations}
            navigate={navigate}
            isNightMode={isNightMode}
            expanded={expanded}
          /> */}
        </div>
      )}
    </motion.div>
  );
};

export default StoryCard;