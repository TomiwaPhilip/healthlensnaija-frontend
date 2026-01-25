import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StoryCard from "./StoryCard"; // 🆕 UPDATED: Use only StoryCard (now handles both)
import { FiChevronLeft, FiChevronRight, FiPlusCircle, FiFilter } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const StoryList = ({
  stories,
  currentPage,
  storiesPerPage,
  setCurrentPage,
  isNightMode,
  handleExportStory,
  handleContinueDiscussion,
  handleChatClick, // 🆕 NEW: Add handleChatClick prop
  navigate,
  openDeleteModal,
  loading,  
  loadingRecs,
  recommendationsMap,
  formatStoryContent
}) => {
  const { t } = useTranslation("story");
  const [sortBy, setSortBy] = useState("newest");
  const [filterTag, setFilterTag] = useState("all");
  const [contentType, setContentType] = useState("all"); // 🆕 NEW: Filter by content type

  // 🆕 UPDATED: Get all unique tags for filtering (from both stories and chats)
  const allTags = React.useMemo(() => {
    const tags = new Set();
    stories.forEach(item => {
      // Only get tags from stories (chats might not have tags)
      if (item.type === 'story' && item.tags) {
        (item.tags || []).forEach(tag => {
          tags.add(typeof tag === 'object' ? tag.name : tag);
        });
      }
    });
    return ['all', ...Array.from(tags)].sort();
  }, [stories]);

  // 🆕 UPDATED: Sort and filter items (both stories and chats)
  const filteredAndSortedItems = React.useMemo(() => {
    let filtered = [...stories];
    
    // 🆕 NEW: Filter by content type
    if (contentType !== 'all') {
      filtered = filtered.filter(item => item.type === contentType);
    }
    
    // Filter by tag (only applies to stories)
    if (filterTag !== 'all') {
      filtered = filtered.filter(item => {
        if (item.type === 'chat') return true; // Keep all chats when filtering by tag
        return (item.tags || []).some(tag => 
          (typeof tag === 'object' ? tag.name : tag) === filterTag
        );
      });
    }
    
    // Sort items by date
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.displayDate || b.createdAt) - new Date(a.displayDate || a.createdAt);
        case 'oldest':
          return new Date(a.displayDate || a.createdAt) - new Date(b.displayDate || b.createdAt);
        case 'title':
          return (a.title || a.name || '').localeCompare(b.title || b.name || '');
        default:
          return 0;
      }
    });
  }, [stories, sortBy, filterTag, contentType]);

  const indexOfLastItem = currentPage * storiesPerPage;
  const indexOfFirstItem = indexOfLastItem - storiesPerPage;
  const currentItems = filteredAndSortedItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAndSortedItems.length / storiesPerPage);

  // 🆕 NEW: Count stories and chats for display
  const storyCount = stories.filter(item => item.type === 'story').length;
  const chatCount = stories.filter(item => item.type === 'chat').length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const emptyStateVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  useEffect(() => {
    // Wait for Framer Motion and DOM updates
    const timeout = setTimeout(() => {
      const storyCards = document.querySelectorAll("[id^='story-'], [id^='chat-']");
      if (storyCards.length > 0) {
        const firstCard = storyCards[0];
        const yOffset = -500; // adjust for sticky header height if needed
        const yPosition = firstCard.getBoundingClientRect().top + window.scrollY + yOffset;
        
        window.scrollTo({
          top: yPosition,
          behavior: "smooth",
        });
      }
    }, 500); // ⏱️ increased delay to let animations settle
  
    return () => clearTimeout(timeout);
  }, [currentPage]);
  
  // 🧱 Show skeleton loader before items arrive
  if (!stories.length && loading) {
    return (
      <div className="space-y-4">
        <Skeleton height={150} className="rounded-xl" />
        <Skeleton height={150} className="rounded-xl" />
        <Skeleton height={150} className="rounded-xl" />
        <Skeleton height={150} className="rounded-xl" />
        <Skeleton height={150} className="rounded-xl" />
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <motion.div
        variants={emptyStateVariants}
        initial="hidden"
        animate="visible"
        className={`p-8 text-center rounded-2xl ${
          isNightMode ? "bg-gray-800 border border-gray-700" : "bg-gray-50 border border-gray-200"
        }`}
      >
        <div className="max-w-md mx-auto">
          <FiPlusCircle className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
          {t("list.emptyTitle")}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
          {t("list.emptySubtitle")}
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => document.getElementById('story-form')?.scrollIntoView({ behavior: 'smooth' })}
            className={`px-6 py-3 rounded-xl font-medium transition-colors ${
              isNightMode
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
           {t("list.emptyButton")}
          </motion.button>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mt-8 transition-all duration-300"
    >
      {/* Header with Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {t("list.title")} ({filteredAndSortedItems.length})
          {/* 🆕 NEW: Show counts */}
          <span className="text-sm font-normal ml-2 text-gray-500 dark:text-gray-400">
            ({storyCount} stories • {chatCount} chats)
          </span>
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* 🆕 NEW: Content Type Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Type:
            </label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className={`px-3 py-2 rounded-lg border text-sm ${
                isNightMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-700"
              }`}
            >
              <option value="all">All Content</option>
              <option value="story">Stories Only</option>
              <option value="chat">Chats Only</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("list.sortBy")}
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-3 py-2 rounded-lg border text-sm ${
                isNightMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-700"
              }`}
            >
              <option value="newest">{t("list.sortNewest")}</option>
              <option value="oldest">{t("list.sortOldest")}</option>
              <option value="title">{t("list.sortTitle")}</option>
            </select>
          </div>

          {/* Filter Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("list.filterBy")}
            </label>
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className={`px-3 py-2 rounded-lg border text-sm ${
                isNightMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-700"
              }`}
            >
              {allTags.map(tag => (
                <option key={tag} value={tag}>
                {tag === 'all' ? t("list.allTags") : tag}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="space-y-6">
        <AnimatePresence mode="sync">
          {currentItems.map((item) => (
            // 🆕 UPDATED: Use StoryCard for both stories and chats (it now handles both)
            <StoryCard
              key={item._id}
              story={item} // Pass the item as 'story' prop (StoryCard now handles both types)
              isNightMode={isNightMode}
              handleExportStory={handleExportStory}
              handleContinueDiscussion={handleContinueDiscussion}
              handleChatClick={handleChatClick} // 🆕 NEW: Pass chat click handler
              navigate={navigate}
              openDeleteModal={openDeleteModal}
              loadingRecs={loadingRecs}
              recommendationsMap={recommendationsMap}
              formatStoryContent={formatStoryContent}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 p-4 rounded-xl bg-gray-50 dark:bg-gray-800"
        >
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {t("list.showing")} {indexOfFirstItem + 1} {t("list.to")}{" "}
            {Math.min(indexOfLastItem, filteredAndSortedItems.length)} {t("list.of")}{" "}
            {filteredAndSortedItems.length} {t("list.stories")}
          </div>
          
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition-colors flex items-center ${
                currentPage === 1
                  ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500"
                  : isNightMode
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-300"
              }`}
            >
              <FiChevronLeft className="h-4 w-4" />
            </motion.button>

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
                  <motion.button
                    key={pageNum}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === pageNum
                        ? isNightMode
                          ? "bg-green-600 text-white"
                          : "bg-green-500 text-white"
                        : isNightMode
                        ? "bg-gray-700 hover:bg-gray-600 text-white"
                        : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-300"
                    }`}
                  >
                    {pageNum}
                  </motion.button>
                );
              })}
              
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <span className="px-2 text-gray-500">...</span>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg transition-colors flex items-center ${
                currentPage === totalPages
                  ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500"
                  : isNightMode
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-300"
              }`}
            >
              <FiChevronRight className="h-4 w-4" />
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* No results message */}
      {filteredAndSortedItems.length === 0 && stories.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-gray-500 dark:text-gray-400"
        >
          <FiFilter className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>{t("list.noResults")}</p>
          <button
            onClick={() => {
              setFilterTag('all');
              setContentType('all');
            }}
            className="text-green-500 dark:text-green-400 hover:underline mt-2"
          >
            {t("list.clearFilters")}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default StoryList;