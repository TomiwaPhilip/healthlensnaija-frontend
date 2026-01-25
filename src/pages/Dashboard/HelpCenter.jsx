import React, { useState, useEffect, useRef } from "react";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/solid";
import { FaSearch, FaTags, FaTimes, FaChevronDown, FaChevronUp, FaPaperPlane, FaRobot, FaUser } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import io from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL;

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

const token = localStorage.getItem("token");

const HelpCenterPage = () => {
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
  
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [expandedIndex, setExpandedIndex] = useState(null);
  
  // Chat states
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [handoffToHuman, setHandoffToHuman] = useState(false);
  
  const messagesEndRef = useRef(null);
  const { t } = useTranslation("help");
  const faqs = t("faqs", { returnObjects: true });
  const tags = t("tags", { returnObjects: true });

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  // Add message to chat
  const addMessage = (text, sender) => {
    const newMessage = {
      id: Date.now(),
      text,
      sender,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, normalizeMessage(newMessage)]);

  };

  // Start chat when opening for first time
  const startChat = async () => {
    try {
      const res = await fetch(`${API_URL}/support/chat/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ subject: "Help Center Support" })
      });

      const data = await res.json();
      setChatId(data._id);
      return data._id;
    } catch (err) {
      console.error("Start chat failed", err);
      return null;
    }
  };

  const toggleChat = async () => {
    const newState = !chatOpen;
    setChatOpen(newState);

    if (newState && messages.length === 0) {
      // Add welcome message when chat first opens
      simulateTyping(QUICK_RESPONSES.quickAnswers[0].response, () => {
        addMessage(QUICK_RESPONSES.quickAnswers[0].response, "bot");
      });
    }
  };

  // Fetch messages when chatId is created
  useEffect(() => {
    if (!chatId) return;

    const loadMessages = async () => {
      try {
        const res = await fetch(`${API_URL}/support/chat/${chatId}/messages`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();
       setMessages(data.map(normalizeMessage));

      } catch (err) {
        console.error("Load messages failed", err);
      }
    };

    loadMessages();
  }, [chatId]);

  // Live updates through socket
  useEffect(() => {
    if (!chatId || handoffToHuman) return;

    const socket = io(API_URL, { auth: { token } });

    socket.emit("support:join", chatId);

    socket.on("support:new-message", ({ message }) => {
      setMessages(prev => [...prev, normalizeMessage(message)]);

    });

    return () => socket.disconnect();
  }, [chatId, handoffToHuman]);

  // Handle sending message
  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message.trim();
    setMessage("");
    
    // Add user message immediately
    addMessage(userMessage, "user");

    // Check if this is a handoff trigger
    const quickResponse = findQuickResponse(userMessage);
    const isHandoff = quickResponse.triggers.includes("immediate_handoff");

    if (isHandoff) {
      setHandoffToHuman(true);
      // Show bot response first
      simulateTyping(quickResponse.response, () => {
        addMessage(quickResponse.response, "bot");
        
        // Then initiate human handoff
        setTimeout(async () => {
          const currentChatId = chatId || await startChat();
          if (currentChatId) {
            try {
              await fetch(`${API_URL}/support/chat/${currentChatId}/messages`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ text: userMessage })
              });
            } catch (err) {
              console.error("Send message to human failed", err);
            }
          }
        }, 1500);
      });
    } else if (!handoffToHuman) {
      // Show bot response for automated answers
      simulateTyping(quickResponse.response, () => {
        addMessage(quickResponse.response, "bot");
      });
    } else {
      // Send to human agent
      const currentChatId = chatId;
      if (currentChatId) {
        try {
          await fetch(`${API_URL}/support/chat/${currentChatId}/messages`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ text: userMessage })
          });
        } catch (err) {
          console.error("Send message to human failed", err);
        }
      }
    }
  };

  // Quick question suggestions
  const quickQuestions = [
    "How do I download my story?",
    "I'm having a problem",
    "Talk to a human agent"
  ];

  const handleQuickQuestion = (question) => {
    setMessage(question);
    // Auto-send after a brief delay
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  // Filter FAQs
  const filteredFaqs = faqs.filter(
    (f) =>
      (!search || f.question.toLowerCase().includes(search.toLowerCase())) &&
      (filter === "all" || f.tag === filter)
  );

  return (
    <div className="p-5 font-sans relative min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">{t("title")}</h1>

        {/* Search */}
        <div className="mb-8">
          <div className="relative mb-4">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {Object.entries(tags).map(([key, label]) => (
              <button
                key={key}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === key
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                }`}
                onClick={() => setFilter(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">{t("faqTitle")}</h2>

          {filteredFaqs.length > 0 ? (
            <ul className="space-y-4">
              {filteredFaqs.map((item, index) => (
                <li key={index} className="border-b border-gray-100 pb-4">
                  <button
                    className="w-full text-left group"
                    onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-gray-800 group-hover:text-green-600 transition-colors">
                        {item.question}
                      </h3>
                      {expandedIndex === index ? (
                        <FaChevronUp className="text-gray-400 ml-3 mt-1" />
                      ) : (
                        <FaChevronDown className="text-gray-400 ml-3 mt-1" />
                      )}
                    </div>
                    <span className="inline-block mt-1 text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                      {tags[item.tag]}
                    </span>
                  </button>
                  {expandedIndex === index && (
                    <div className="mt-3 text-gray-600">
                      <p>{item.answer}</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {t("noResults")}
            </div>
          )}
        </div>

        {/* Contact - Simplified */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <h3 className="text-lg font-semibold mb-2">{t("contact.title")}</h3>
          <p className="text-gray-600 mb-4">{t("contact.subtitle")}</p>
          <button
            onClick={toggleChat}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Chat with Support
          </button>
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 flex items-center transition-transform hover:scale-105"
      >
        <ChatBubbleLeftEllipsisIcon className="h-6 w-6" />
      </button>

      {/* Enhanced Chat Popup */}
      {chatOpen && (
        <div className="fixed bottom-24 right-6 bg-white shadow-xl rounded-lg w-80 overflow-hidden border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="bg-green-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
              <h3 className="text-lg font-bold">Support Chat</h3>
            </div>
            <button onClick={toggleChat} className="text-white hover:text-green-200">
              <FaTimes />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 h-80 overflow-y-auto space-y-3 bg-gray-50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 ${
                    m.sender === "user"
                      ? "bg-green-500 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    {m.sender === "bot" && <FaRobot className="text-green-500 text-xs" />}
                    {m.sender === "user" && <FaUser className="text-green-200 text-xs" />}
                    <span className="text-xs opacity-75">
                      {m.sender === "bot" ? "Sonia" : "You"}
                    </span>
                  </div>
                  <p className="text-sm">{m.text}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 rounded-2xl rounded-bl-none p-3 border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <FaRobot className="text-green-500 text-xs" />
                    <span className="text-xs opacity-75">Sonia</span>
                  </div>
                  <div className="flex space-x-1 mt-1">
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions - Show only at beginning */}
          {messages.length <= 2 && !handoffToHuman && (
            <div className="px-4 pb-2">
              <div className="text-xs text-gray-500 mb-2">Quick questions:</div>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || isTyping}
                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FaPaperPlane className="text-sm" />
              </button>
            </div>
            {handoffToHuman && (
              <div className="text-xs text-green-600 mt-2 text-center">
                ✓ Connected to live support team
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpCenterPage;