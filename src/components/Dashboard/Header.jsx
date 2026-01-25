import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaSearch, FaSignOutAlt, FaSpinner, FaUser } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import avatar from "../../assets/Image.png";
import readingIcon from "../../assets/reading-icon.png";
import { getInitials } from "../../utils/helpers";

const Header = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [user, setUser] = useState({});
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const search = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/search?q=${searchQuery}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setSearchResults(response.data);
        setShowResults(true);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(search, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, API_URL]);

  const handleResultClick = (result) => {
    setShowResults(false);
  
    switch (result.type) {
      case "chat":
        navigate(`/ai-chat?chatId=${result.id}`);
        break;
      case "story":
      case "opensearch-story":
        navigate(`/generate-story?storyId=${result.id}`);
        break;
      default:
        console.warn("Unknown result type:", result.type);
        break;
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found in localStorage");
          setIsLoadingUser(false);
          return;
        }
  
        const response = await axios.get(`${API_URL}/dashboard/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (response.status === 200) {
          setUser(response.data);
          localStorage.setItem("userId", response.data._id); 
        }
      } catch (error) {
        console.error("Error fetching user data:", error.response?.data || error.message);
      } finally {
        setIsLoadingUser(false);
      }
    };
  
    fetchUserData();
  }, [API_URL]);

  
  // 🔔 Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(`${API_URL}/notifications`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 200) {
          setNotifications(response.data); // expects an array
        }
      } catch (error) {
        console.error("Error fetching notifications:", error.response?.data || error.message);
      }
    };

    fetchNotifications();

    // optional: refresh notifications every 60s
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [API_URL]);
  
  
  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      return "Good Morning";
    } else if (currentHour >= 12 && currentHour < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showProfileMenu) setShowProfileMenu(false);
  };

  const closeNotifications = () => {
    setShowNotifications(false);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
    if (showNotifications) setShowNotifications(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.reload();
  };

  // Animation variants
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-sm"
    >
      {/* Top Bar - Search and User Controls */}
      <div className="px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">
        {/* Search Bar - Full width on mobile, constrained on desktop */}
        <div className="relative w-full sm:flex-1 sm:max-w-xl lg:max-w-2xl">
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 shadow-sm hover:shadow-md transition-all duration-200 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent">
            <FaSearch className="text-green-700 mr-2 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search stories, files or conversations..."
              className="w-full outline-none text-gray-700 placeholder-gray-400 bg-transparent text-sm sm:text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
            />
            {isSearching && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="ml-2"
              >
                <FaSpinner className="animate-spin text-gray-400" />
              </motion.div>
            )}
          </div>
          
          <AnimatePresence>
            {showResults && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-lg z-50 mt-1 max-h-96 overflow-y-auto border border-gray-200"
              >
                {searchResults.length > 0 ? (
                  searchResults.map((result) => (
                    <motion.div
                      key={`${result.type}-${result.id}`}
                      whileHover={{ backgroundColor: "#f9fafb" }}
                      className="p-3 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                      onClick={() => handleResultClick(result)}
                    >
                      <div className="flex items-center">
                        <span className="mr-3 text-lg">
                          {result.type === "chat" && (
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                              💬
                            </div>
                          )}
                          {result.type === "document" && (
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                              📄
                            </div>
                          )}
                          {result.type === "story" && (
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                              📰
                            </div>
                          )}
                        </span>
                        <div className="overflow-hidden">
                          <p className="font-medium truncate text-gray-800 text-sm sm:text-base">{result.name}</p>
                          <div className="flex items-center mt-1">
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 capitalize">
                              {result.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500 text-sm sm:text-base">
                    {searchQuery.length >= 2 ? "No results found" : "Type at least 2 characters"}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Section - Notification and Profile */}
        <div className="flex items-center space-x-4 sm:space-x-6 w-full sm:w-auto justify-between sm:justify-normal mt-2 sm:mt-0">
          {/* Notification Bell */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleNotifications}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
              aria-label="Notifications"
            >
              <FaBell className="text-gray-600 text-lg" />
              {notifications.length > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1 inline-block w-2 h-2 bg-red-500 rounded-full"
                />
              )}
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-30 z-40 sm:hidden"
                    onClick={closeNotifications}
                  />
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute right-0 mt-2 bg-white shadow-xl rounded-lg w-72 sm:w-80 max-h-80 overflow-y-auto z-50 border border-gray-200"
                  >
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          {notifications.length} New
                        </span>
                      </div>
                    </div>
                    <ul className="divide-y divide-gray-100">
                      {notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-3 hover:bg-gray-50 cursor-pointer"
                          >
                            <div className="flex items-start">
                              <div className="flex-shrink-0 mr-3">
                                <span
                                  className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                                    notification.type === "approval"
                                      ? "bg-green-100 text-green-600"
                                      : "bg-red-100 text-red-600"
                                  }`}
                                >
                                  {notification.type === "approval" ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {notification.title}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {notification.time}
                                </p>
                              </div>
                            </div>
                          </motion.li>
                        ))
                      ) : (
                        <motion.li
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="p-4 text-center"
                        >
                          <div className="flex flex-col items-center justify-center py-4">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <p className="text-sm text-gray-500 mt-2">
                              No new notifications
                            </p>
                          </div>
                        </motion.li>
                      )}
                    </ul>
                    {notifications.length > 0 && (
                      <div className="p-3 border-t border-gray-200 text-center">
                        <button className="text-xs text-green-600 hover:text-green-800 font-medium">
                          Mark all as read
                        </button>
                      </div>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleProfileMenu}
              className="flex items-center space-x-2 cursor-pointer group"
            >
              {isLoadingUser ? (
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-200 flex items-center justify-center">
                  <FaSpinner className="animate-spin text-gray-400 text-sm sm:text-base" />
                </div>
              ) : user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-green-500 object-cover group-hover:border-green-600 transition-colors"
                />
              ) : (
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-green-500 text-white flex items-center justify-center border-2 border-green-500 group-hover:border-green-600 group-hover:bg-green-600 transition-colors text-xs sm:text-sm">
                  {user.firstName && user.lastName ? (
                    getInitials(user.firstName, user.lastName)
                  ) : (
                    <FaUser className="text-white" />
                  )}
                </div>
              )}
              <div className="hidden sm:block text-left">
                <p className="font-medium text-gray-800 text-sm">
                  {isLoadingUser ? "Loading..." : `${user.firstName} ${user.lastName}`}
                </p>
                <p className="text-xs text-gray-500">
                  {user.role || "Member"}
                </p>
              </div>
            </motion.button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute right-0 mt-2 bg-white shadow-xl rounded-lg w-48 z-50 border border-gray-200"
                >
                  <div className="p-4 border-b border-gray-200">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                  <ul className="p-2">
                    <motion.li
                      whileHover={{ backgroundColor: "#f9fafb" }}
                      className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-gray-900 cursor-pointer rounded transition-colors"
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt className="mr-2 text-gray-500" /> 
                      <span>Logout</span>
                    </motion.li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Greeting Section */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="px-4 sm:px-6 py-4 bg-gradient-to-r from-green-50 to-green-50 text-green-800 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 border-t border-gray-100"
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            {getGreeting()}, {isLoadingUser ? "..." : `${user.firstName}`}
            <span className="text-green-600">!</span>
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            What would you like to create today?
          </p>
        </div>
        <motion.div 
          className="relative"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <img 
            src={readingIcon} 
            alt="Reading Icon" 
            className="w-12 h-12 sm:w-16 sm:h-16"
          />
          <motion.div 
            className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full"
            animate={{ 
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              repeat: Infinity,
              duration: 2
            }}
          >
            ✨
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Header;