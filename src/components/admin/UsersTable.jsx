import React, { useState, useEffect } from "react";
import axios from "../../utils/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";

export default function UsersTable({ users, setUsers }) {
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [userSortField, setUserSortField] = useState("firstName");
  const [userSortOrder, setUserSortOrder] = useState("asc");
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- Filters & Sort ---
  const filteredUsers = users
    .filter((u) =>
      `${u.firstName} ${u.lastName} ${u.email}`
        .toLowerCase()
        .includes(userSearch.toLowerCase())
    )
    .sort((a, b) => {
      const valA = a[userSortField] || "";
      const valB = b[userSortField] || "";
      if (valA < valB) return userSortOrder === "asc" ? -1 : 1;
      if (valA > valB) return userSortOrder === "asc" ? 1 : -1;
      return 0;
    });

  // Update pagination when filteredUsers changes
  useEffect(() => {
    setTotalPages(Math.ceil(filteredUsers.length / itemsPerPage));
    // Reset to first page if current page exceeds total pages
    if (currentPage > Math.ceil(filteredUsers.length / itemsPerPage)) {
      setCurrentPage(1);
    }
  }, [filteredUsers, itemsPerPage, currentPage]);

  // Get current users for pagination
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page
  };

  // --- Bulk User Actions ---
  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) return;
    if (!window.confirm(`Are you sure you want to ${action} ${selectedUsers.length} user(s)?`)) return;

    setIsLoading(true);
    try {
      await axios.post("/admin-dashboard/users/bulk", {
        action, userIds: selectedUsers
      });
      const { data } = await axios.get("/admin-dashboard/users");
      setUsers(data);
      setSelectedUsers([]);
      setSelectAll(false);
    } catch (err) {
      alert("Bulk action failed: " + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  // --- Save User ---
  const handleUserSave = async () => {
    setIsLoading(true);
    try {
      if (editingUser._id) {
        const res = await axios.put(`/admin-dashboard/users/${editingUser._id}`, editingUser);
        setUsers(users.map((u) => (u._id === editingUser._id ? res.data : u)));
      } else {
        const res = await axios.post(`/admin-dashboard/users`, editingUser);
        setUsers([...users, res.data]);
      }
      setEditingUser(null);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Delete ---
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    setIsLoading(true);
    try {
      await axios.delete(`/admin-dashboard/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };

  const slideUp = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } }
  };

  const stagger = {
    visible: {
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  // Pagination component
  const Pagination = () => {
    const pageNumbers = [];
    const maxPageButtons = isMobile ? 3 : 5;
    
    // Calculate start and end page numbers for pagination
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
    
    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white border-t border-gray-200 rounded-b-lg">
        <div className="flex items-center mb-4 sm:mb-0">
          <span className="text-sm text-gray-700 mr-2">Show</span>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
          <span className="text-sm text-gray-700 ml-2">entries</span>
        </div>
        
        <div className="flex items-center">
          <span className="text-sm text-gray-700 mr-4 hidden sm:block">
            Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} entries
          </span>
          
          <nav className="flex items-center space-x-1">
            <button
              onClick={() => paginate(1)}
              disabled={currentPage === 1}
              className="px-2 py-1 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2 py-1 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            {pageNumbers.map(number => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  currentPage === number 
                    ? 'bg-green-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {number}
              </button>
            ))}
            
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2 py-1 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            <button
              onClick={() => paginate(totalPages)}
              disabled={currentPage === totalPages}
              className="px-2 py-1 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    );
  };

  return (
    <motion.section 
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="p-4 md:p-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">User Management</h2>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setEditingUser({ firstName: "", lastName: "", email: "", role: "Guest", suspended: false })}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
          Add User
        </motion.button>
      </div>

      {/* Bulk Action Toolbar */}
      <AnimatePresence>
        {selectedUsers.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-6 p-4 bg-green-50 border border-green-100 rounded-lg"
          >
            <div className="flex flex-wrap gap-2">
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleBulkAction("suspend")} 
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg shadow transition-colors duration-200 flex items-center gap-2 text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Suspend
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleBulkAction("unsuspend")} 
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg shadow transition-colors duration-200 flex items-center gap-2 text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Unsuspend
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleBulkAction("verify")} 
                className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-2 rounded-lg shadow transition-colors duration-200 flex items-center gap-2 text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verify
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleBulkAction("promote")} 
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg shadow transition-colors duration-200 flex items-center gap-2 text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                </svg>
                Promote
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleBulkAction("delete")} 
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg shadow transition-colors duration-200 flex items-center gap-2 text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Delete
              </motion.button>
            </div>
            <div className="mt-2 text-sm text-green-600">
              {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search & Sort */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <motion.div 
          variants={slideUp}
          className="relative flex-1"
        >
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search users..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
          />
        </motion.div>
        
        <div className="flex gap-2">
          <motion.select
            variants={slideUp}
            value={userSortField}
            onChange={(e) => setUserSortField(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
          >
            <option value="firstName">First Name</option>
            <option value="lastName">Last Name</option>
            <option value="email">Email</option>
            <option value="role">Role</option>
          </motion.select>
          
          <motion.button
            variants={slideUp}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setUserSortOrder(userSortOrder === "asc" ? "desc" : "asc")}
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg shadow-sm transition-colors duration-200 flex items-center gap-2"
          >
            {userSortOrder === "asc" ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Asc
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Desc
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Users Table */}
      <motion.div 
        variants={fadeIn}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
      <div className="overflow-x-auto">
  {/* ✅ Desktop Table */}
  <div className="hidden md:block">
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={(e) => {
                setSelectAll(e.target.checked);
                setSelectedUsers(e.target.checked ? currentUsers.map((u) => u._id) : []);
              }}
              className="h-4 w-4 text-green-600 rounded focus:ring-green-500 border-gray-300"
            />
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        <AnimatePresence>
          {currentUsers.length > 0 ? (
            currentUsers.map((u) => (
              <tr key={u._id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(u._id)}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedUsers([...selectedUsers, u._id]);
                      else setSelectedUsers(selectedUsers.filter((id) => id !== u._id));
                    }}
                    className="h-4 w-4 text-green-600 rounded focus:ring-green-500 border-gray-300"
                  />
                </td>
                <td className="px-4 py-4">{u.firstName} {u.lastName}</td>
                <td className="px-4 py-4 text-sm text-gray-500">{u.email}</td>
                <td className="px-4 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${u.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                      u.role === 'StandardUser' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${u.suspended ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {u.suspended ? 'Suspended' : 'Active'}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <button onClick={() => setEditingUser({ ...u })} className="text-green-600 hover:text-green-900">✏️</button>
                    <button onClick={() => handleDelete(u._id)} className="text-red-600 hover:text-red-900">🗑</button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center text-gray-500 py-10">No users found</td>
            </tr>
          )}
        </AnimatePresence>
      </tbody>
    </table>
  </div>

  {/* ✅ Mobile Cards */}
  <div className="md:hidden space-y-4">
    {currentUsers.length > 0 ? (
      currentUsers.map((u) => (
        <div key={u._id} className="bg-white shadow rounded-lg p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium">
                {u.firstName.charAt(0)}{u.lastName.charAt(0)}
              </div>
              <div>
                <div className="font-medium text-gray-900">{u.firstName} {u.lastName}</div>
                <div className="text-sm text-gray-500">{u.email}</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={selectedUsers.includes(u._id)}
              onChange={(e) => {
                if (e.target.checked) setSelectedUsers([...selectedUsers, u._id]);
                else setSelectedUsers(selectedUsers.filter((id) => id !== u._id));
              }}
              className="h-4 w-4 text-green-600 rounded focus:ring-green-500 border-gray-300"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium 
              ${u.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                u.role === 'StandardUser' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'}`}>
              {u.role}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium 
              ${u.suspended ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
              {u.suspended ? 'Suspended' : 'Active'}
            </span>
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={() => setEditingUser({ ...u })} className="text-green-600 hover:text-green-900">✏️ Edit</button>
            <button onClick={() => handleDelete(u._id)} className="text-red-600 hover:text-red-900">🗑 Delete</button>
          </div>
        </div>
      ))
    ) : (
      <div className="text-center text-gray-500 py-6">No users found</div>
    )}
  </div>
</div>

        {/* Pagination */}
        {filteredUsers.length > 0 && <Pagination />}
      </motion.div>

      {/* User Modal */}
      <AnimatePresence>
        {editingUser && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setEditingUser(null)}
          >
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {editingUser._id ? "Edit User" : "Add User"}
                  </h3>
                  <button 
                    onClick={() => setEditingUser(null)}
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      placeholder="First Name"
                      value={editingUser.firstName}
                      onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={editingUser.lastName}
                      onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="Email"
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      value={editingUser.role}
                      onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="Guest">Guest</option>
                      <option value="StandardUser">Standard User</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="suspended"
                      checked={editingUser.suspended || false}
                      onChange={(e) => setEditingUser({ ...editingUser, suspended: e.target.checked })}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="suspended" className="ml-2 block text-sm text-gray-700">
                      Suspended
                    </label>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setEditingUser(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleUserSave}
                    disabled={isLoading}
                    className={`px-4 py-2 rounded-lg text-white ${isLoading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} transition-colors duration-200 flex items-center gap-2`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      'Save'
                    )}
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