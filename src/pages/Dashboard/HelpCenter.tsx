import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, ChevronDown, ChevronUp, Send, Bot, User, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import io from "socket.io-client";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

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
    <div className="flex flex-col min-h-screen bg-background pt-14 md:pt-0">
      <div className="flex-1 p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
              {t("title")}
            </h1>
            <p className="text-muted-foreground text-sm">
              Find answers and get support instantly
            </p>
          </div>

          {/* Search Section */}
          <div className="rounded-lg border border-border bg-card p-6 mb-8 shadow-sm">
            <div className="space-y-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t("searchPlaceholder")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-10 border-input bg-background text-sm"
                />
              </div>

              {/* Filter Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {Object.entries(tags).map(([key, label]) => (
                  <Button
                    key={key}
                    variant="ghost"
                    size="sm"
                    onClick={() => setFilter(key)}
                    className={
                      filter === key
                        ? "bg-accent text-accent-foreground text-sm"
                        : "bg-transparent dark:bg-card text-muted-foreground border border-border hover:bg-accent/5 dark:hover:bg-accent/10 text-sm"
                    }
                  >
                    {label as string}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* FAQs Section */}
          <Card className="p-8 border-border bg-card mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              {t("faqTitle")}
            </h2>

              {filteredFaqs.length > 0 ? (
              <div className="space-y-3">
                {filteredFaqs.map((item, index) => (
                  <div
                    key={index}
                    className="border-b border-border last:border-b-0 pb-4 last:pb-0"
                  >
                    <button
                      className="w-full text-left group py-2"
                      onClick={() =>
                        setExpandedIndex(expandedIndex === index ? null : index)
                      }
                    >
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="font-medium text-base text-foreground group-hover:text-accent transition-colors">
                          {item.question}
                        </h3>
                        <div className="flex-shrink-0 mt-1">
                          {expandedIndex === index ? (
                            <ChevronUp className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                      <Badge variant="outline" className="inline-block mt-2 text-xs bg-accent/5 text-foreground px-3 py-1 rounded-full">
                        {tags[item.tag]}
                      </Badge>
                    </button>
                    {expandedIndex === index && (
                      <div className="mt-3 text-muted-foreground pl-1 pb-2">
                        <p className="text-sm leading-relaxed">{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-sm">{t("noResults")}</p>
                <p className="text-sm mt-2">Try adjusting your search or filters</p>
              </div>
            )}
          </Card>

          {/* Contact Support Section */}
          <Card className="p-8 text-center border-border bg-card/50 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-foreground mb-3">
              {t("contact.title")}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {t("contact.subtitle")}
            </p>
            <Button
              onClick={toggleChat}
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Start a Conversation
            </Button>
          </Card>
        </div>
      </div>

      {/* Floating Chat Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-accent hover:bg-accent/90 text-accent-foreground p-4 rounded-full shadow-lg transition-all hover:scale-110 z-40 border-0"
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Popup Modal */}
      {chatOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-h-[600px] bg-card border border-border rounded-xl shadow-2xl flex flex-col z-50 animate-in slide-in-from-bottom-4">
          {/* Chat Header */}
          <div className="bg-accent text-accent-foreground p-4 flex justify-between items-center rounded-t-xl border-b border-border/10">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-accent-foreground/60 rounded-full animate-pulse"></div>
              <h3 className="text-lg font-semibold">Support Chat</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleChat}
              className="text-accent-foreground hover:bg-accent/80 h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-2 max-w-[85%]`}>
                  {m.sender === "bot" && (
                    <div className="flex-shrink-0 mt-1">
                      <Bot className="w-5 h-5 text-accent" />
                    </div>
                  )}
                  <div
                    className={`rounded-lg px-4 py-2 text-sm ${
                      m.sender === "user"
                        ? "bg-accent text-accent-foreground rounded-br-none"
                        : "bg-secondary text-secondary-foreground rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{m.text}</p>
                  </div>
                  {m.sender === "user" && (
                    <div className="flex-shrink-0 mt-1">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-2 items-center">
                  <Bot className="w-5 h-5 text-accent flex-shrink-0" />
                  <div className="bg-secondary text-secondary-foreground rounded-lg px-4 py-2 flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions - Show only at beginning */}
          {messages.length <= 2 && !handoffToHuman && (
            <div className="px-4 py-3 border-t border-border bg-background/50">
              <div className="text-xs text-muted-foreground font-medium mb-2">
                Quick questions:
              </div>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickQuestion(question)}
                    className="text-xs h-8 border-border"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-border bg-background rounded-b-xl">
            <div className="flex gap-2 mb-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={isTyping}
                className="flex-1 h-9 border-input bg-card"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || isTyping}
                size="icon"
                className="h-9 w-9 bg-accent hover:bg-accent/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            {handoffToHuman && (
              <div className="text-xs text-accent font-medium text-center py-1">
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