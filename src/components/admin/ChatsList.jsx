import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiMessageSquare, 
  FiUser, 
  FiMail, 
  FiX, 
  FiChevronDown, 
  FiChevronUp, 
  FiChevronLeft,   // ← add this
  FiChevronRight,  // ← add this
  FiSearch 
} from "react-icons/fi";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ChatsList({ chats }) {
  const [selectedChat, setSelectedChat] = useState(null);
  const [expandedChats, setExpandedChats] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Toggle chat expansion
  const toggleChatExpansion = (chatId) => {
    setExpandedChats(prev => ({
      ...prev,
      [chatId]: !prev[chatId]
    }));
  };

  // Filter chats based on search term
  const filteredChats = chats.filter(chat => {
    const searchLower = searchTerm.toLowerCase();
    return (
      chat.userId?.firstName?.toLowerCase().includes(searchLower) ||
      chat.userId?.lastName?.toLowerCase().includes(searchLower) ||
      chat.userId?.email?.toLowerCase().includes(searchLower) ||
      chat.messages.some(m => m.text.toLowerCase().includes(searchLower))
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredChats.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedChats = filteredChats.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring",
        damping: 20,
        stiffness: 300
      }
    }
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-4 p-4 md:p-6"
    >
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-[#30B349] flex items-center gap-2">
          <FiMessageSquare className="text-[#8CC43D]" />
          AI Conversations
        </h2>
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30B349] focus:border-transparent"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
          />
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {/* Pagination Controls - Top */}
      {filteredChats.length > 0 && (
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-3 rounded-lg shadow-sm border border-gray-100"
        >
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredChats.length)} of {filteredChats.length} conversations
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 whitespace-nowrap">Show:</label>
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
        </motion.div>
      )}

      <motion.div 
        variants={itemVariants}
        className="bg-white rounded-lg md:rounded-xl shadow-lg border border-gray-100 overflow-hidden"
      >
        {filteredChats.length === 0 ? (
          <div className="p-6 md:p-8 text-center text-gray-500">
            {searchTerm ? "No matching chats found" : "No conversations available"}
          </div>
        ) : (
          <ul className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
            <AnimatePresence>
              {paginatedChats.map((chat) => (
                <motion.li 
                  key={chat._id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}
                  className="p-3 md:p-4 hover:bg-gray-50 transition-colors"
                  layout
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="bg-[#8CC43D]/20 text-[#30B349] p-2 rounded-full">
                        <FiUser size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-gray-900 truncate">
                          {chat.userId?.firstName} {chat.userId?.lastName}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1 truncate">
                          <FiMail size={14} /> {chat.userId?.email || "No email"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleChatExpansion(chat._id)}
                      className="text-[#30B349] hover:text-[#8CC43D] transition-colors flex-shrink-0 ml-2"
                    >
                      {expandedChats[chat._id] ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                  </div>

                  <AnimatePresence>
                    {expandedChats[chat._id] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-3 pl-11 space-y-2"
                      >
                        {chat.messages.slice(0, expandedChats[chat._id] ? chat.messages.length : 3).map((m, idx) => (
                          <motion.div 
                            key={idx} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`p-3 rounded-lg ${m.user === "You" ? "bg-green-50" : "bg-gray-50"}`}
                          >
                            <p className={`font-medium ${m.user === "You" ? "text-green-700" : "text-gray-700"}`}>
                              {m.user}:
                            </p>
                            <p className="text-gray-800">{m.text}</p>
                          </motion.div>
                        ))}
                        
                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            onClick={() => {
                              setSelectedChat(chat);
                              toast.info("Viewing full conversation");
                            }}
                            className="text-sm text-[#30B349] hover:text-[#8CC43D] font-medium flex items-center gap-1 px-3 py-1 rounded-md hover:bg-[#30B349]/10 transition-colors"
                          >
                            View full chat
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </motion.div>

      {/* Pagination Controls - Bottom */}
      {totalPages > 1 && (
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100"
        >
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
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
              className="p-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        </motion.div>
      )}

      {/* Full Chat Modal */}
      <AnimatePresence>
        {selectedChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedChat(null)}
          >
            <motion.div
              variants={modalVariants}
              className="bg-white rounded-lg md:rounded-xl shadow-xl w-full max-w-2xl md:max-w-3xl max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 md:p-6 border-b flex justify-between items-center">
                <div className="min-w-0">
                  <h3 className="text-lg md:text-xl font-bold text-[#30B349] truncate">
                    Conversation with {selectedChat.userId?.firstName} {selectedChat.userId?.lastName}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 truncate">
                    <FiMail size={14} /> {selectedChat.userId?.email}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedChat(null)}
                  className="text-gray-500 hover:text-gray-700 flex-shrink-0 ml-2"
                >
                  <FiX size={24} />
                </button>
              </div>
              
              <div className="p-4 md:p-6 overflow-y-auto flex-1 space-y-3">
                {selectedChat.messages.map((m, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: m.user === "You" ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`flex ${m.user === "You" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[90%] md:max-w-[80%] p-3 md:p-4 rounded-xl ${m.user === "You" ? "bg-[#30B349] text-white" : "bg-gray-100 text-gray-800"}`}>
                      <p className="font-medium text-sm md:text-base">{m.user}</p>
                      <p className="text-sm md:text-base">{m.text}</p>
                      <p className={`text-xs mt-1 ${m.user === "You" ? "text-green-100" : "text-gray-500"}`}>
                        {new Date(m.timestamp || Date.now()).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="p-4 border-t flex justify-end">
                <button
                  onClick={() => {
                    setSelectedChat(null);
                    toast.success("Conversation closed");
                  }}
                  className="px-4 py-2 bg-[#30B349] text-white rounded-lg hover:bg-[#2a9e40] transition-colors text-sm md:text-base"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}