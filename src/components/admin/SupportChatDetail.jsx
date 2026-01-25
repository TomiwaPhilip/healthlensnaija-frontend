// src/components/admin/SupportChatDetail.jsx
import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "../../utils/axiosInstance";
import { makeSocket } from "../../utils/socket";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

import notifySound from "../../assets/notify.mp3";

export default function SupportChatDetail({ chatId, onBack }) {
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [seenAt, setSeenAt] = useState(null);
  const [ended, setEnded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const messagesRef = useRef();
  
  // 🔥 FIX: Use a stable socket connection
  const socket = useMemo(() => makeSocket(), []); // Remove chatId dependency

  const soundRef = useRef(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    soundRef.current = new Audio(notifySound);
    soundRef.current.load();
  
    const unlock = () => {
      soundRef.current.play().then(() => {
        soundRef.current.pause();
        soundRef.current.currentTime = 0;
        document.removeEventListener("click", unlock);
      }).catch(() => {});
    };
    document.addEventListener("click", unlock);
  
    return () => document.removeEventListener("click", unlock);
  }, []);

  // Fetch thread metadata & messages
  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        // 🔥 FIX: Fetch specific chat details instead of all chats
        const [chatRes, messagesRes] = await Promise.all([
          axios.get(`/support/admin/chats`).then(res => res.data.find(c => c._id === chatId)),
          axios.get(`/support/chat/${chatId}/messages`)
        ]);
        
        if (chatRes) {
          setChat(chatRes);
          setStatus(chatRes.status);
          setPriority(chatRes.priority);
          setEnded(chatRes.status === "closed");
        }
        
        if (messagesRes.data) {
          setMessages(messagesRes.data);
        }
      } catch (error) {
        toast.error("Failed to load chat details");
        console.error("Error loading chat:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (chatId) {
      load();
      // mark as read when admin opens
      axios.put(`/support/chat/${chatId}/read`).catch(() => {});
    }
  }, [chatId]);

  // 🔥 FIX: Improved Socket event handling
  // useEffect(() => {
  //   if (!socket || !chatId) return;

  //   console.log("🔄 Setting up socket listeners for chat:", chatId);

  //   const joinRoom = () => {
  //     socket.emit("support:join", chatId);
  //     socket.emit("support:join-admin"); // Join admin room
  //     console.log(`✅ Admin joined support room: ${chatId}`);
  //   };

  //   socket.on("connect", joinRoom);
    
  //   // Join immediately if already connected
  //   if (socket.connected) {
  //     joinRoom();
  //   }

  //   const onNewMessage = ({ chatId: incomingId, message }) => {
  //     console.log("📨 New message received:", { incomingId, chatId, message });
      
  //     if (incomingId !== chatId) return;
      
  //     setMessages((prev) => {
  //       // Check if message already exists to prevent duplicates
  //       const messageExists = prev.some(
  //         m => m._id === message._id || 
  //         (m.text === message.text && m.user === message.user && m.createdAt === message.createdAt)
  //       );
        
  //       if (messageExists) {
  //         console.log("📨 Message already exists, skipping");
  //         return prev;
  //       }
        
  //       console.log("📨 Adding new message to state");
  //       return [...prev, message];
  //     });

  //     // 🔔 play sound if it's from user or AI
  //     if (message.user !== "agent" && soundRef.current) {
  //       soundRef.current.currentTime = 0;
  //       soundRef.current.play().catch(() => {});
  //     }
      
  //     // Auto-mark as read for new user messages
  //     if (message.user === "user") {
  //       axios.put(`/support/chat/${chatId}/read`).catch(() => {});
  //     }
  //   };

  //   const onAdminNewMessage = ({ chatId: incomingId, message }) => {
  //     console.log("📨 Admin room message:", { incomingId, chatId, message });
  //     if (incomingId === chatId) {
  //       onNewMessage({ chatId: incomingId, message });
  //     }
  //   };

  //   const onSeen = ({ chatId: incomingId, seenAt }) => {
  //     if (incomingId === chatId) {
  //       console.log("👀 Chat seen at:", seenAt);
  //       setSeenAt(seenAt);
  //     }
  //   };

  //   const onEnded = ({ chatId: incomingId }) => {
  //     if (incomingId === chatId) {
  //       console.log("🔴 Chat ended");
  //       setEnded(true);
  //       setStatus("closed");
  //     }
  //   };

  //   // 🔥 FIX: Listen to all relevant events
  //   socket.on("support:new-message", onNewMessage);
  //   socket.on("support:admin-new-message", onAdminNewMessage);
  //   socket.on("support:seen", onSeen);
  //   socket.on("support:ended", onEnded);
  //   socket.on("support:metadata-updated", ({ chatId: incomingId, status, priority }) => {
  //     if (incomingId === chatId) {
  //       if (status) setStatus(status);
  //       if (priority) setPriority(priority);
  //       if (status === "closed") setEnded(true);
  //     }
  //   });

  //   return () => {
  //     console.log("🧹 Cleaning up socket listeners");
  //     socket.off("support:new-message", onNewMessage);
  //     socket.off("support:admin-new-message", onAdminNewMessage);
  //     socket.off("support:seen", onSeen);
  //     socket.off("support:ended", onEnded);
  //     socket.off("support:metadata-updated");
  //     socket.off("connect", joinRoom);
  //   };
  // }, [chatId, socket]);


  useEffect(() => {
    if (!socket || !chatId) return;
  
    const joinRooms = () => {
      socket.emit("support:join", chatId); 
      socket.emit("support:join-admin"); 
    };
  
    // join right away if connected
    if (socket.connected) joinRooms();
    socket.on("connect", joinRooms);
  
    const handleIncoming = ({ chatId: incomingId, message }) => {
      if (incomingId !== chatId) return;
  
      setMessages(prev => {
        const exists = prev.some(m =>
          m._id === message._id ||
          (m.text === message.text && m.user === message.user && m.createdAt === message.createdAt)
        );
        if (exists) return prev;
        return [...prev.filter(m => !m._localId || m.text !== message.text), message];
      });
  
      if (message.user === "user") {
        axios.put(`/support/chat/${chatId}/read`).catch(() => {});
      }
  
      if (message.user !== "agent" && soundRef.current) {
        soundRef.current.currentTime = 0;
        soundRef.current.play().catch(() => {});
      }
    };
  
    socket.on("support:new-message", handleIncoming);
    socket.on("support:admin-new-message", handleIncoming);
  
    socket.on("support:seen", ({ chatId: incomingId, seenAt }) => {
      if (incomingId === chatId) setSeenAt(seenAt);
    });
  
    socket.on("support:ended", ({ chatId: incomingId }) => {
      if (incomingId === chatId) {
        setEnded(true);
        setStatus("closed");
      }
    });
  
    socket.on("support:metadata-updated", ({ chatId: incomingId, status, priority }) => {
      if (incomingId !== chatId) return;
      if (status) {
        setStatus(status);
        if (status === "closed") setEnded(true);
      }
      if (priority) setPriority(priority);
    });
  
    return () => {
      socket.off("connect", joinRooms);
      socket.off("support:new-message", handleIncoming);
      socket.off("support:admin-new-message", handleIncoming);
      socket.off("support:seen");
      socket.off("support:ended");
      socket.off("support:metadata-updated");
    };
  }, [chatId, socket]);

  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const sendReply = async () => {
    if (!reply.trim() || ended) return;
    const text = reply;
    const localId = Date.now();

    setReply("");
    
    // 🔥 FIX: Better optimistic update
    // const optimisticMessage = { 
    //   user: "agent", 
    //   text, 
    //   _localId: localId,
    //   createdAt: new Date().toISOString()
    // };

    const optimisticMessage = {
      user: "agent",
      text,
      _localId: localId,
      createdAt: new Date().toISOString(),
      pending: true
    };
    
    
    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      await axios.post(`/support/chat/${chatId}/messages`, { text, askAI: false });
      console.log("✅ Message sent successfully");
    } catch (err) {
      console.error("Send failed", err);
      toast.error("Failed to send message");
      setMessages((prev) =>
        prev.map((m) => 
          m._localId === localId ? { ...m, failed: true }
      : m
        )
      );
    }
  };

  const updateMeta = async (field, value) => {
    try {
      await axios.put(`/support/chat/${chatId}/${field}`, { [field]: value });
      setChat((c) => ({ ...c, [field]: value }));
      if (field === "status") {
        setStatus(value);
        if (value === "closed") setEnded(true);
      } else if (field === "priority") {
        setPriority(value);
      }
      toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`);
    } catch (error) {
      toast.error(`Failed to update ${field}`);
      console.error(`Error updating ${field}:`, error);
    }
  };

  const endChat = async () => {
    try {
      await axios.put(`/support/chat/${chatId}/end`);
      setEnded(true);
      setStatus("closed");
      toast.success("Chat ended successfully");
    } catch (error) {
      toast.error("Failed to end chat");
      console.error("Error ending chat:", error);
    }
  };

  const transcriptHtml = chat
    ? `
      <div style="font-family:Arial,sans-serif;color:#333;">
        <h3>Support Conversation Transcript</h3>
        <p><b>Subject:</b> ${chat.subject}</p>
        <p><b>Status:</b> ${chat.status}</p>
        <hr/>
        ${messages
          .map(
            (m) => `
            <p>
              <b>${m.user}:</b> ${m.text} 
              <span style="color:#888;font-size:11px">
                (${new Date(m.createdAt || chat.updatedAt).toLocaleString()})
              </span>
            </p>
          `
          )
          .join("")}
      </div>
    `
    : "";

  const sendTranscript = async () => {
    try {
      const res = await axios.post(`/support/chat/${chatId}/mail`);
      setShowModal(false);
      toast.success(res.data.message || "Transcript sent successfully");
    } catch (err) {
      setShowModal(false);
      console.error("Mail failed", err);
      toast.error("Failed to send transcript");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!chat) return <div className="p-4 text-center text-gray-500">Conversation not found</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col h-full"
    >
      {/* Mobile header with back button and menu toggle */}
      <div className="lg:hidden flex items-center justify-between p-3 border-b bg-white">
        <button 
          onClick={onBack} 
          className="text-green-500 hover:text-green-700 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
        
        <h2 className="text-lg font-semibold truncate max-w-xs">{chat.subject || "Support Chat"}</h2>
        
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1 rounded-md text-gray-500 hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      {/* Desktop back button */}
      <div className="hidden lg:block mb-2">
        <button 
          onClick={onBack} 
          className="text-sm text-green-500 hover:text-green-700 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Chats
        </button>
      </div>
      
      <div className="flex-1 flex flex-col border rounded-lg shadow-sm bg-white overflow-hidden">
        {/* Header: Metadata controls */}
        <div className="px-4 py-3 border-b bg-gray-50 flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-3 lg:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 mr-1">Status:</span>
              <select
                value={status}
                disabled={ended}
                onChange={(e) => updateMeta("status", e.target.value)}
                className="px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {["open", "pending", "resolved", "closed"].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 mr-1">Priority:</span>
              <select
                value={priority}
                disabled={ended}
                onChange={(e) => updateMeta("priority", e.target.value)}
                className="px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {["low", "normal", "high"].map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="hidden lg:block text-xs text-gray-500">
            Last update: {new Date(chat.updatedAt).toLocaleString()}
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-gray-50 border-b px-4 py-3"
            >
              <div className="flex flex-wrap gap-2">
                {!ended && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={endChat}
                    className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded transition-colors flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    End Chat
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowModal(true)} 
                  className="px-3 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email Transcript
                </motion.button>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Last update: {new Date(chat.updatedAt).toLocaleString()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop action buttons */}
        <div className="hidden lg:flex px-4 py-2 border-b bg-gray-50 justify-between items-center">
          <div className="flex gap-2">
            {!ended && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={endChat}
                className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                End Chat
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(true)} 
              className="px-3 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Transcript
            </motion.button>
          </div>
        </div>

        {/* Message history */}
        <div 
          ref={messagesRef} 
          className="px-3 sm:px-4 py-4 grow overflow-y-auto bg-gray-50 space-y-3"
          style={{ maxHeight: 'calc(100vh - 220px)' }}
        >
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No messages yet. Start the conversation.
            </div>
          ) : (
            messages.map((m, i) => (
              <motion.div
                key={m._id || m._localId || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${m.user === "agent" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs sm:max-w-sm md:max-w-md p-3 rounded-lg ${
                    m.user === "agent" 
                      ? "bg-green-500 text-white rounded-br-none" 
                      : m.user === "ai"
                      ? "bg-purple-500 text-white rounded-bl-none"
                      : "bg-white border border-gray-200 rounded-bl-none"
                  } shadow-sm ${m.error ? "border border-red-300 bg-red-50" : ""}`}
                >
                  <div className="text-sm break-words">{m.text}</div>
                  <div className={`text-xs mt-1 ${
                    m.user === "agent" ? "text-green-100" : 
                    m.user === "ai" ? "text-purple-100" : 
                    "text-gray-500"
                  }`}>
                    {new Date(m.createdAt || chat.updatedAt).toLocaleTimeString()}
                    {i === messages.length - 1 && seenAt && m.user === "agent" && (
                      <span className="ml-2">✓ Seen</span>
                    )}
                    {m.pending && !m.failed && (
  <span className="ml-2 text-gray-400">Sending…</span>
)}

{m.failed && (
  <span className="ml-2 text-red-400">Failed</span>
)}

                  </div>
                </div>
              </motion.div>
            ))
          )}
          
          {ended && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-xs text-red-600 mt-4 p-2 bg-red-50 rounded-lg border border-red-100"
            >
              This conversation has been closed. No further messages can be sent.
            </motion.div>
          )}
        </div>

        {/* Reply input */}
        {!ended && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 border-t bg-white"
          >
            <div className="flex space-x-2">
              <input
                className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendReply()}
                placeholder="Type your reply…"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={sendReply}
                disabled={!reply.trim()}
                className={`px-4 py-2 rounded-lg transition-all ${
                  reply.trim() 
                    ? "bg-green-500 hover:bg-green-600 text-white" 
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <span className="hidden sm:inline">Send</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Modal for transcript */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 sm:p-6 border-b">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Preview Transcript
                </h3>
              </div>
              
              <div className="p-4 sm:p-6 overflow-y-auto flex-1">
                <div
                  className="border p-3 sm:p-4 rounded-lg bg-gray-50 text-sm"
                  dangerouslySetInnerHTML={{ __html: transcriptHtml }}
                />
              </div>
              
              <div className="p-3 sm:p-4 border-t bg-gray-50 flex justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowModal(false)}
                  className="px-3 sm:px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sendTranscript}
                  className="px-3 sm:px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send to User
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}