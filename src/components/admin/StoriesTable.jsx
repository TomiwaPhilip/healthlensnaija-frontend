import React, { useState } from "react";
import axios from "../../utils/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiEdit, 
  FiTrash2, 
  FiPlus, 
  FiSearch, 
  FiChevronUp, 
  FiChevronDown, 
  FiChevronLeft,   // ← add this
  FiChevronRight,  // ← add this
  FiX, 
  FiMenu 
} from "react-icons/fi";

export default function StoriesTable({ stories, setStories }) {
  const [editingStory, setEditingStory] = useState(null);
  const [storySearch, setStorySearch] = useState("");
  const [storySortField, setStorySortField] = useState("createdAt");
  const [storySortOrder, setStorySortOrder] = useState("desc");
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // --- Filter & Sort ---
  const filteredStories = stories
    .filter((s) =>
      `${s.title} ${s.content_summary || ""}`
        .toLowerCase()
        .includes(storySearch.toLowerCase())
    )
    .sort((a, b) => {
      const valA = a[storySortField] || "";
      const valB = b[storySortField] || "";
      return storySortOrder === "asc"
        ? valA > valB ? 1 : -1
        : valA < valB ? 1 : -1;
    });

  // Pagination
  const totalPages = Math.ceil(filteredStories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStories = filteredStories.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  // --- Save Story ---
  const handleStorySave = async () => {
    setIsLoading(true);
    try {
      if (editingStory._id) {
        const res = await axios.put(`/admin-dashboard/stories/${editingStory._id}`, editingStory);
        setStories(stories.map((s) => (s._id === editingStory._id ? res.data : s)));
      } else {
        const res = await axios.post(`/admin-dashboard/stories`, editingStory);
        setStories([...stories, res.data]);
      }
      setEditingStory(null);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Delete Story ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this story?")) return;
    setIsLoading(true);
    try {
      await axios.delete(`/admin-dashboard/stories/${id}`);
      setStories(stories.filter((s) => s._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-4 md:p-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <motion.h2 
          className="text-xl md:text-2xl font-bold text-gray-800"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
        >
          Stories Management
        </motion.h2>
        
        <div className="flex gap-2 w-full md:w-auto">
          <motion.button
            onClick={() => setEditingStory({ title: "", content: "", generatedBy: "" })}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 md:px-4 py-2 rounded-lg shadow-md transition-all w-full md:w-auto justify-center"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiPlus className="h-4 w-4 md:h-5 md:w-5" /> 
            <span className="hidden md:inline">Add New Story</span>
            <span className="md:hidden">Add Story</span>
          </motion.button>
          
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            <FiMenu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Search & Sort - Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div 
          className="md:hidden bg-white p-4 rounded-lg shadow-md mb-4 space-y-3"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search stories..."
              value={storySearch}
              onChange={(e) => setStorySearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
            />
            {storySearch && (
              <button 
                onClick={() => setStorySearch("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX />
              </button>
            )}
          </div>
          
          <div className="flex gap-2">
            <select
              value={storySortField}
              onChange={(e) => setStorySortField(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm"
            >
              <option value="createdAt">Created At</option>
              <option value="title">Title</option>
              <option value="generatedBy">Author</option>
            </select>
            <motion.button
              onClick={() => setStorySortOrder(storySortOrder === "asc" ? "desc" : "asc")}
              className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors text-sm"
              whileTap={{ scale: 0.95 }}
            >
              {storySortOrder === "asc" ? <FiChevronUp /> : <FiChevronDown />}
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Search & Sort - Desktop */}
      <motion.div 
        className="hidden md:flex flex-col md:flex-row justify-between mb-6 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search stories by title or content..."
            value={storySearch}
            onChange={(e) => setStorySearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
          />
          {storySearch && (
            <button 
              onClick={() => setStorySearch("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <FiX />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <select
            value={storySortField}
            onChange={(e) => setStorySortField(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
          >
            <option value="createdAt">Created At</option>
            <option value="title">Title</option>
            <option value="generatedBy">Author</option>
          </select>
          <motion.button
            onClick={() => setStorySortOrder(storySortOrder === "asc" ? "desc" : "asc")}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            {storySortOrder === "asc" ? <FiChevronUp /> : <FiChevronDown />}
            {storySortOrder === "asc" ? "Ascending" : "Descending"}
          </motion.button>
        </div>
      </motion.div>

      {/* Pagination Controls - Top */}
      {filteredStories.length > 0 && (
        <motion.div 
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-3 rounded-lg shadow-sm border border-gray-100 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredStories.length)} of {filteredStories.length} stories
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

      {/* Table */}
      <motion.div 
        className="bg-white rounded-lg md:rounded-xl shadow-md overflow-hidden"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Author</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Created At</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {paginatedStories.length > 0 ? (
                  paginatedStories.map((s) => (
                    <motion.tr 
                      key={s._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-4 py-4">
                        <div className="font-medium text-gray-900">{s.title}</div>
                        {s.content_summary && (
                          <div className="text-sm text-gray-500 line-clamp-2 max-w-xs">{s.content_summary}</div>
                        )}
                        <div className="text-xs text-gray-400 md:hidden mt-1">
                          {new Date(s.createdAt).toLocaleDateString()} • {s.generatedBy}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{s.generatedBy}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                        {new Date(s.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <motion.button 
                            onClick={() => setEditingStory({ ...s })}
                            className="text-green-600 hover:text-green-900 p-1 md:p-2"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Edit"
                          >
                            <FiEdit className="h-4 w-4 md:h-5 md:w-5" />
                          </motion.button>
                          <motion.button 
                            onClick={() => handleDelete(s._id)}
                            className="text-red-600 hover:text-red-900 p-1 md:p-2"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Delete"
                          >
                            <FiTrash2 className="h-4 w-4 md:h-5 md:w-5" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                      {storySearch ? "No matching stories found" : "No stories available"}
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Pagination Controls - Bottom */}
      {totalPages > 1 && (
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
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
                        ? "bg-green-600 text-white"
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

      {/* Modal */}
      <AnimatePresence>
        {editingStory && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-lg md:rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: -20 }}
            >
              <div className="p-4 md:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg md:text-xl font-bold text-gray-800">
                    {editingStory._id ? "Edit Story" : "Create New Story"}
                  </h3>
                  <button
                    onClick={() => setEditingStory(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      placeholder="Story title"
                      value={editingStory.title}
                      onChange={(e) => setEditingStory({ ...editingStory, title: e.target.value })}
                      className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <textarea
                      placeholder="Story content"
                      value={editingStory.content}
                      onChange={(e) => setEditingStory({ ...editingStory, content: e.target.value })}
                      className="w-full h-32 md:h-40 px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    />
                  </div>
                  
                  {editingStory.generatedBy && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                      <input
                        type="text"
                        value={editingStory.generatedBy}
                        onChange={(e) => setEditingStory({ ...editingStory, generatedBy: e.target.value })}
                        className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <motion.button
                    onClick={() => setEditingStory(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm md:text-base"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleStorySave}
                    disabled={isLoading}
                    className={`px-4 py-2 rounded-lg text-white ${isLoading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} transition-colors text-sm md:text-base`}
                    whileHover={{ scale: isLoading ? 1 : 1.03 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  >
                    {isLoading ? 'Saving...' : 'Save Story'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}