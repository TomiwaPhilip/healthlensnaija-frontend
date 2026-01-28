// src/components/ChatbotWidget.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "../utils/axiosInstance";
import { makeSocket } from "../utils/socket";
import notifySound from "../assets/notify.mp3"; 
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageCircle, FiX, FiSend, FiHelpCircle, FiUser } from "react-icons/fi";
import { FaRobot } from "react-icons/fa";

const QUICK_RESPONSES = {
  "quickAnswers": [
    {
      "patterns": ["hello", "hi", "hey", "good morning", "good afternoon"],
      "response": "Hello! I'm Sonia, your Healthlens Naija support assistant. How can I help you today? 😊",
      "triggers": ["greeting"]
    },
    {
      "patterns": ["download", "save", "export", "get my story", "how to download"],
      "response": "You can download your stories directly from your dashboard! Look for the download icon below each story. Would you like me to guide you through the process?",
      "triggers": ["feature_help"]
    },
    {
      "patterns": ["problem", "issue", "not working", "error", "bug", "broken", "fix"],
      "response": "I'm sorry you're experiencing issues! Let me help troubleshoot. Could you describe what's happening in more detail?",
      "triggers": ["troubleshooting"]
    },
    {
      "patterns": ["thank", "thanks", "appreciate"],
      "response": "You're welcome! Is there anything else I can help you with today?",
      "triggers": ["gratitude"]
    },
    {
      "patterns": ["human", "agent", "representative", "real person", "talk to someone", "live agent"],
      "response": "Of course! Let me connect you with our support team. One moment please...",
      "triggers": ["immediate_handoff"]
    },
    {
      "patterns": ["help", "support", "what can you do"],
      "response": "I can help you with story generation, content downloads, account issues, or connect you with our live support team. What do you need assistance with?",
      "triggers": ["general_help"]
    }
  ]
};

const ChatMessage = ({ who, text, seen, isLoading }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2 }}
    className={`mb-2 flex ${who === "user" ? "justify-end" : "justify-start"}`}
  >
    <div
      className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
        who === "user" 
          ? "bg-[#30B349] text-white" 
          : isLoading
            ? "bg-gray-200 text-gray-500"
            : "bg-gray-100 text-gray-900"
      }`}
    >
      {isLoading ? (
        <div className="flex items-center gap-1">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <span className="ml-2">Thinking...</span>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-1">
            {who === "user" ? <FiUser size={12} /> : <FaRobot size={12} />}
            <span className="text-xs font-medium">
              {who === "user" ? "You" : "Sonia"}
            </span>
          </div>
          {text}
          {seen && who === "user" && (
            <span className="ml-2 text-[10px] text-gray-300">✓ Seen</span>
          )}
        </>
      )}
    </div>
  </motion.div>
);

const ChatbotWidget = () => {
  const normalizeMessage = (m) => {
    const sender = m.sender || m.user || "system";
  
    return {
      id: m.id || m._id || Date.now() + Math.random(),
      text: m.text || "",
      sender,       // used by React UI
      user: sender, // compatibility for socket
      timestamp: m.timestamp || m.createdAt || new Date()
    };
  };
  

  const [open, setOpen] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [ended, setEnded] = useState(false);
  const [seenAt, setSeenAt] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [handoffToHuman, setHandoffToHuman] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Quick question suggestions
  const quickQuestions = [
    "How do I download my story?",
    "I'm having a problem",
    "Talk to a human agent"
  ];

  useEffect(() => {
    const savedChatId = localStorage.getItem("supportChatId");
    if (savedChatId) {
      axios.get(`/support/chat/${savedChatId}/messages`).then(res => {
        const msgs = res.data || [];
    setMessages(msgs.map(normalizeMessage));

        const chatClosed = msgs.some(m => m.text && m.text.includes("has been closed"));
        if (chatClosed) setEnded(true);
        setHandoffToHuman(true); // If there's a saved chat, we're in human mode
      });
    }
  }, []);

  // sound ref
  const soundRef = useRef(null);
  useEffect(() => {
    soundRef.current = new Audio(notifySound);
  }, []);

  // socket
  const socket = useMemo(() => makeSocket(chatId), [chatId]);
  useEffect(() => {
    if (!socket || !chatId) return;

    const joinRoom = () => socket.emit("support:join", chatId);
    socket.on("connect", joinRoom);
    joinRoom();

    socket.on("support:new-message", ({ chatId: incomingId, message }) => {
      if (incomingId !== chatId) return;
      setMessages((prev) => [...prev, normalizeMessage(message)]);

      if (message.user === "agent" && soundRef.current) {
        soundRef.current.currentTime = 0;
        soundRef.current.play().catch(() => {});
      }
    });

    socket.on("support:seen", ({ chatId: incomingId, seenAt }) => {
      if (incomingId === chatId) setSeenAt(seenAt);
    });

    socket.on("support:ended", ({ chatId: incomingId, message }) => {
      if (incomingId === chatId) {
        setEnded(true);
        setMessages(prev => [
          ...prev,
          { user: "system", text: message || "🔴 This chat has been closed by the support team." }
        ]);
        localStorage.removeItem("supportChatId");
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [chatId, socket]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open, isLoading]);

  // Auto-focus input when chat opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [open]);

  // Find matching response from JSON
  const findQuickResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    for (const answer of QUICK_RESPONSES.quickAnswers) {
      for (const pattern of answer.patterns) {
        if (lowerMessage.includes(pattern)) {
          return answer;
        }
      }
    }
    
    // Return general help if no match found
    return QUICK_RESPONSES.quickAnswers.find(answer => 
      answer.triggers.includes("general_help")
    );
  };

  // Simulate typing delay for bot responses
  const simulateTyping = (response, callback) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      callback();
    }, 1000 + Math.random() * 1000);
  };

  // Add message to chat
  const addMessage = (text, sender) => {
    const newMessage = {
      id: Date.now(),
      text,
      sender,
      timestamp: new Date(),
      user: sender // For compatibility with existing socket structure
    };
    setMessages(prev => [...prev, normalizeMessage(newMessage)]);

  };

  // Start chat with human agent
  const startChat = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post("/support/chat/start", { subject: "Help Center Support" });
      const newChatId = res.data._id;
      setChatId(newChatId);
      localStorage.setItem("supportChatId", newChatId);
      setMessages((m) => [...m, ...(res.data.messages || [])]);
      setEnded(false);
      setHandoffToHuman(true);
      return newChatId;
    } catch (error) {
      console.error("Failed to start chat:", error);
      addMessage("Sorry, I couldn't connect you to a live agent right now. Please try again later.", "ai");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sending message - FIXED SUBMIT LOGIC
  const handleSendMessage = async () => {
    if (!input.trim() || isLoading || ended) return;
    
    const userMessage = input.trim();
    setInput("");
    
    // Add user message immediately
    addMessage(userMessage, "user");

    if (handoffToHuman && chatId) {
      // Send to human agent
      try {
        await axios.post(`/support/chat/${chatId}/messages`, { 
          text: userMessage,
          askAI: false 
        });
      } catch (error) {
        console.error("Send message to human failed:", error);
        addMessage("Failed to send message. Please try again.", "ai");
      }
    } else {
      // AI mode - find and send quick response
      const quickResponse = findQuickResponse(userMessage);
      const isHandoff = quickResponse.triggers.includes("immediate_handoff");

      if (isHandoff) {
        // Show bot response first
        simulateTyping(quickResponse.response, () => {
          addMessage(quickResponse.response, "ai");
          
          // Then initiate human handoff
          setTimeout(async () => {
            const currentChatId = await startChat();
            if (currentChatId) {
              try {
                await axios.post(`/support/chat/${currentChatId}/messages`, { 
                  text: `User requested human agent: ${userMessage}` 
                });
              } catch (err) {
                console.error("Send message to human failed", err);
              }
            }
          }, 1500);
        });
      } else {
        // Show bot response for automated answers
        simulateTyping(quickResponse.response, () => {
          addMessage(quickResponse.response, "ai");
        });
      }
    }
  };

  // Handle quick question click
  const handleQuickQuestion = (question) => {
    setInput(question);
    // Auto-send after a brief delay
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Open chat and show welcome message if first time
  const handleOpenChat = () => {
    const newOpenState = !open;
    setOpen(newOpenState);

    if (newOpenState && messages.length === 0 && !handoffToHuman) {
      // Add welcome message when chat first opens
      setTimeout(() => {
        simulateTyping(QUICK_RESPONSES.quickAnswers[0].response, () => {
          addMessage(QUICK_RESPONSES.quickAnswers[0].response, "ai");
        });
      }, 500);
    }
  };

  return (
    <>
      {/* FAB */}
      <motion.button
        onClick={handleOpenChat}
        className="fixed bottom-6 right-6 z-50 rounded-full bg-[#30B349] text-white w-14 h-14 shadow-xl flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {open ? <FiX size={24} /> : <FiMessageCircle size={24} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-4 md:right-6 z-50 w-[340px] max-h-[70vh] bg-white rounded-2xl shadow-2xl border flex flex-col"
          >
            {/* Header */}
            <div className="p-3 border-b flex items-center justify-between bg-[#30B349] text-white rounded-t-2xl">
              <div className="font-semibold flex items-center gap-2">
                <FiHelpCircle size={18} /> 
                {handoffToHuman ? "Live Support" : "Sonia Assistant"}
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${handoffToHuman ? 'bg-green-300' : 'bg-yellow-300'} animate-pulse`}></div>
                <span className="px-2 py-1 rounded text-xs bg-white text-[#30B349] font-medium">
                  {handoffToHuman ? "Live" : "AI"}
                </span>
              </div>
            </div>

            {/* Body */}
            <div ref={scrollRef} className="p-3 overflow-y-auto flex-1 bg-gray-50">
              {messages.map((m, i) => (
                <ChatMessage
                  key={m.id || i}
                  who={m.user === "user" ? "user" : "ai"}
                  text={m.text}
                  seen={i === messages.length - 1 && seenAt}
                  isLoading={m.isLoading}
                />
              ))}

              {/* Quick Questions - Show only at beginning in AI mode */}
              {messages.length <= 2 && !handoffToHuman && (
                <div className="mt-4 p-2 border rounded-lg bg-white">
                  <div className="text-xs text-gray-500 mb-2 font-medium">Quick questions:</div>
                  <div className="flex flex-col gap-2">
                    {quickQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickQuestion(question)}
                        className="text-xs text-left bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors border"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Handoff Status */}
              {handoffToHuman && (
                <div className="text-center">
                  <div className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full inline-block mt-2">
                    ✓ Connected to live support team
                  </div>
                </div>
              )}
            </div>

            {/* Footer - FIXED SUBMIT */}
            <div className="p-2 border-t bg-white">
              {ended ? (
                <div className="text-center text-xs text-red-600 py-2 font-medium">
                  🔴 This conversation has been closed. You can no longer send messages.
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="flex-1 border rounded-lg px-3 py-2 text-sm disabled:bg-gray-100 disabled:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#30B349] focus:border-transparent"
                    placeholder={handoffToHuman ? "Type your message to support..." : "Ask me anything..."}
                    disabled={isLoading || ended}
                  />
                  <motion.button
                    onClick={handleSendMessage}
                    disabled={isLoading || !input.trim() || ended}
                    className={`px-3 py-2 rounded-lg text-sm transition-all ${
                      ended || isLoading || !input.trim()
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-[#30B349] hover:bg-[#25963A] text-white"
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiSend size={16} />
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;