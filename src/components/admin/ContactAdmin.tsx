import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiTrash2, FiCheckCircle, FiMessageSquare, FiUser, FiClock } from "react-icons/fi";
import { toast } from "react-toastify";
import axios from "../../utils/axiosInstance";

const API_URL = import.meta.env.VITE_API_URL;

const ContactAdmin = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyOpen, setReplyOpen] = useState({}); // { [msgId]: boolean }
  const [replyText, setReplyText] = useState({}); // { [msgId]: string }
  const [sendingReply, setSendingReply] = useState({}); // { [msgId]: boolean }

  // try to detect current admin from localStorage (fallback to Admin)
  let currentAdminId = null;
  let currentAdminName = "Admin";
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user) {
      currentAdminId = user._id || null;
      currentAdminName = user.name || user.fullName || user.username || currentAdminName;
    }
  } catch (e) {
    // ignore parse errors
  }

  // Animation variants matching your design system
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.95
    }
  };

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const res = await axios.get("/contact");
         setMessages(res.data);
    } catch (error) {
      console.error("❌ Failed to fetch messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(`/contact/${id}/read`);
      setMessages((prev) =>
        prev.map((m) =>
          m._id === id ? { ...m, read: true, justRead: true } : m
        )
      );
      toast.success("Marked as read");
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) => (m._id === id ? { ...m, justRead: false } : m))
        );
      }, 800);
    } catch (err) {
      toast.error("Error marking message as read");
    }
  };

  const deleteMessage = async (id) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
       await axios.delete(`/contact/${id}`);
      setMessages((prev) => prev.filter((m) => m._id !== id));
      toast.info("Message deleted successfully");
    } catch (err) {
      toast.error("Error deleting message");
    }
  };

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const unreadCount = messages.filter(msg => !msg.read).length;

  // toggle reply UI
  const toggleReply = (id) => {
    setReplyOpen((prev) => ({ ...prev, [id]: !prev[id] }));
    // prefill replyText with empty if not existing
    setReplyText((prev) => ({ ...prev, [id]: prev[id] || "" }));
  };

  const handleReplyChange = (id, value) => {
    setReplyText((prev) => ({ ...prev, [id]: value }));
  };

  // send reply to backend
  const sendReply = async (id) => {
    const text = (replyText[id] || "").trim();
    if (!text) {
      toast.warn("Please type a reply message.");
      return;
    }

    // optimistic UI send flag
    setSendingReply((prev) => ({ ...prev, [id]: true }));

    try {
      const payload = {
        text,
        adminId: currentAdminId,
        adminName: currentAdminName,
      };

      await axios.post(`/contact/${id}/reply`, payload);
      
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || "Failed to send reply");
      }

      // update local message: append reply and mark replied/read
      setMessages((prev) =>
        prev.map((m) => {
          if (m._id !== id) return m;
          const newReply = {
            adminId: currentAdminId || null,
            adminName: currentAdminName,
            text,
            createdAt: new Date().toISOString(),
          };
          const replies = Array.isArray(m.replies) ? [...m.replies, newReply] : [newReply];
          return { ...m, replies, replied: true, read: true };
        })
      );

      toast.success("Reply sent");
      // close and clear the reply box
      setReplyOpen((prev) => ({ ...prev, [id]: false }));
      setReplyText((prev) => ({ ...prev, [id]: "" }));
    } catch (err) {
      console.error("❌ Failed to send reply:", err);
      toast.error("Failed to send reply");
    } finally {
      setSendingReply((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <motion.div
      className="relative min-h-screen py-8 px-4 sm:px-6 lg:px-8 overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Subtle background animations matching your design system */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.05 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-green-500 mix-blend-multiply filter blur-3xl animate-blob"
      />
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.05 }}
        transition={{ duration: 1.5, delay: 0.8 }}
        className="absolute top-0 right-20 w-64 h-64 rounded-full bg-green-500 mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"
      />
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.05 }}
        transition={{ duration: 1.5, delay: 1.1 }}
        className="absolute -bottom-8 left-20 w-64 h-64 rounded-full bg-purple-500 mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"
      />

      <div className="relative max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <motion.h1
            className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4 text-gray-900"
            whilehover={{ scale: 1.02 }}
          >
            Contact Messages
          </motion.h1>
          <motion.div
            className="h-1 w-20 bg-green-500 mx-auto mb-4"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          />

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <motion.div
              variants={itemVariants}
              whilehover={{ y: -2, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
              className="p-4 bg-white rounded-xl shadow-md border border-gray-100 text-center"
            >
              <div className="flex items-center justify-center space-x-2">
                <FiMessageSquare className="text-2xl text-green-500" />
                <span className="text-2xl font-bold text-gray-800">{messages.length}</span>
              </div>
              <p className="text-gray-600 mt-1">Total Messages</p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whilehover={{ y: -2, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
              className="p-4 bg-white rounded-xl shadow-md border border-gray-100 text-center"
            >
              <div className="flex items-center justify-center space-x-2">
                <FiMail className="text-2xl text-green-500" />
                <span className="text-2xl font-bold text-gray-800">{unreadCount}</span>
              </div>
              <p className="text-gray-600 mt-1">Unread Messages</p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whilehover={{ y: -2, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
              className="p-4 bg-white rounded-xl shadow-md border border-gray-100 text-center"
            >
              <div className="flex items-center justify-center space-x-2">
                <FiUser className="text-2xl text-purple-500" />
                <span className="text-2xl font-bold text-gray-800">
                  {new Set(messages.map(msg => msg.email)).size}
                </span>
              </div>
              <p className="text-gray-600 mt-1">Unique Contacts</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Messages List */}
        {loading ? (
          <motion.div variants={itemVariants} className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            <p className="mt-4 text-gray-600">Loading messages...</p>
          </motion.div>
        ) : messages.length === 0 ? (
          <motion.div variants={itemVariants} className="text-center py-12">
            <FiMessageSquare className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No messages yet</h3>
            <p className="text-gray-500">Contact messages will appear here when users reach out.</p>
          </motion.div>
        ) : (
          <motion.div variants={itemVariants} className="space-y-4">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className={`relative p-6 rounded-xl shadow-sm transition-all duration-300 border ${
                    msg.read
                      ? "bg-white border-gray-200"
                      : "bg-green-50 border-green-200 shadow-md"
                  } ${msg.justRead ? "animate-pulse bg-green-100" : ""}`}
                  whilehover={{ y: -2, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                >
                  {!msg.read && (
                    <div className="absolute left-0 top-0 bottom-0 w-2 bg-green-500 rounded-l-xl" />
                  )}

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <FiUser className="text-green-500" />
                          <h2 className="font-semibold text-gray-800 text-lg">{msg.name}</h2>
                        </div>
                        {!msg.read && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            New
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-gray-600 mb-3">
                        <FiMail className="text-green-500" />
                        <p className="text-sm">{msg.email}</p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {msg.message}
                        </p>
                      </div>

                      {/* replies list (if any) */}
                      {Array.isArray(msg.replies) && msg.replies.length > 0 && (
                        <div className="mt-4 space-y-3">
                          {msg.replies.map((r, i) => (
                            <div key={i} className="p-3 bg-gray-50 border border-gray-100 rounded">
                              <div className="text-sm text-gray-700 whitespace-pre-wrap">{r.text}</div>
                              <div className="text-xs text-gray-400 mt-2">
                                — {r.adminName} · {new Date(r.createdAt).toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                        <FiClock className="text-purple-500" />
                        <span>{new Date(msg.createdAt).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col gap-2 sm:gap-3">
                      {!msg.read && (
                        <motion.button
                          onClick={() => markAsRead(msg._id)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-medium"
                          variants={buttonVariants}
                          whilehover="hover"
                          whiletap="tap"
                        >
                          <FiCheckCircle size={16} />
                          Mark Read
                        </motion.button>
                      )}

                      <motion.button
                        onClick={() => toggleReply(msg._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium"
                        variants={buttonVariants}
                        whilehover="hover"
                        whiletap="tap"
                      >
                        Reply
                      </motion.button>

                      <motion.button
                        onClick={() => deleteMessage(msg._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-medium"
                        variants={buttonVariants}
                        whilehover="hover"
                        whiletap="tap"
                      >
                        <FiTrash2 size={16} />
                        Delete
                      </motion.button>
                    </div>
                  </div>

                  {/* Reply box */}
                  {replyOpen[msg._id] && (
                    <div className="mt-4">
                      <textarea
                        value={replyText[msg._id] || ""}
                        onChange={(e) => handleReplyChange(msg._id, e.target.value)}
                        rows={4}
                        placeholder={`Reply to ${msg.name} (${msg.email})`}
                        className="w-full border rounded p-3 resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
                      />
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => sendReply(msg._id)}
                          disabled={sendingReply[msg._id]}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium disabled:opacity-50"
                        >
                          {sendingReply[msg._id] ? "Sending..." : "Send Reply"}
                        </button>
                        <button
                          onClick={() => {
                            setReplyOpen((prev) => ({ ...prev, [msg._id]: false }));
                            setReplyText((prev) => ({ ...prev, [msg._id]: "" }));
                          }}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ContactAdmin;
