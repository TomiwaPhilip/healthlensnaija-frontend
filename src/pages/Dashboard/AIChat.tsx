import React, { useState, useContext, useEffect, useRef, useMemo } from "react";
import {
  PaperAirplaneIcon,
  PlusIcon,
  TrashIcon,
  StopCircleIcon,
  ShareIcon,
  PencilIcon,
  ArrowDownTrayIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon
} from "@heroicons/react/24/solid";
import { FaTwitter as TwitterIcon, FaEnvelope as MailIcon } from "react-icons/fa";
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { DashboardContext } from "../../context/DashboardContext";
import jsPDF from "jspdf";
import DOMPurify from "dompurify";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

const AIChat = () => {
  const { t } = useTranslation(["chat"]);
  const { isNightMode } = useContext(DashboardContext);
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [isChatDropdownVisible, setIsChatDropdownVisible] = useState(false);
  const [isMessageDropdownVisible, setIsMessageDropdownVisible] = useState(false);
  const [editingChatId, setEditingChatId] = useState(null);
  const [editedChatName, setEditedChatName] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [headerDropdownOpen, setHeaderDropdownOpen] = useState(false);
  const typingInterval = useRef(null);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const chatId = searchParams.get("chatId");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedMessageText, setEditedMessageText] = useState("");
  const [editHistory, setEditHistory] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  

  const handleCopyForEdit = (msg) => {
    const plain = msg.text.replace(/<[^>]+>/g, '');
    setInput(plain);
    setEditingMessageId(msg._id);
    setEditHistory([plain]);
    setEditIndex(0);
  };

  
  const highlightChat = (chatId) => {
    const chatElement = document.getElementById(`chat-${chatId}`);
    if (chatElement) {
      chatElement.classList.add("ring-2", "ring-green-500"); // temporary highlight style
      chatElement.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        chatElement.classList.remove("ring-2", "ring-green-500");
      }, 2000);
    }
  };
  
  // Handle window resize to detect mobile devices
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      // Auto-close sidebar when switching to mobile
      if (mobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  
  
  useEffect(() => {
    // ⚡ Step 1: Load all cached chats instantly (to keep sidebar visible)
    const cachedChats = Object.keys(localStorage)
      .filter(key => key.startsWith("chat_"))
      .map(key => {
        try {
          return JSON.parse(localStorage.getItem(key));
        } catch {
          return null;
        }
      })
      .filter(Boolean);


  
    if (cachedChats.length > 0) {

      cachedChats.forEach(chat => {
        chat.messages = (chat.messages || []).map(m => ({
          ...m,
          text: m.text || ""
        }));
      });
    
      setChats(prev => {
        const merged = [...prev];
        cachedChats.forEach(cached => {
          const exists = merged.some(chat => chat._id === cached._id);
          if (!exists) merged.push(cached);
        });
        
        return merged;
      });
    }
  
    // ⚡ Step 2: If coming from "Continue Discussion", prioritize that chat
    const cachedChatKey = `chat_${chatId}`;
    const cachedChat = localStorage.getItem(cachedChatKey);
    if (cachedChat) {
      const parsedChat = JSON.parse(cachedChat);
      setActiveChatId(parsedChat._id);
    }
  
    // ⚡ Step 3: Fetch server chats in background
    const fetchChats = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${API_URL}/chat/history`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await response.json();
        if (!data?.chats) return;
  
        setChats(prev => {
          const merged = [...prev];
          data.chats.forEach(serverChat => {
            const index = merged.findIndex(c => c._id === serverChat._id);
            if (index === -1) {
              merged.push(serverChat);
            } else {
              merged[index] = {
                ...merged[index],
                ...serverChat,
                messages: serverChat.messages?.length
                  ? serverChat.messages
                  : merged[index].messages,
              };
            }
          });
          return merged;
        });
  
        // ⚡ Maintain correct active chat
        if (chatId && chatId !== "undefined") {
          const foundChat = data.chats.find(c => c._id === chatId);
          if (foundChat) {
            setActiveChatId(foundChat._id);
            highlightChat(foundChat._id);
          }
        } else if (data.chats.length > 0) {
          setActiveChatId(prev => prev || data.chats[0]._id);
        }
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      }
    };
  
    fetchChats();
  }, [chatId]);
  
  useEffect(() => {
    const loadChats = async () => {
      // Load cached chats first
      const cachedChats = Object.keys(localStorage)
        .filter(key => key.startsWith("chat_"))
        .map(key => {
          try {
            return JSON.parse(localStorage.getItem(key));
          } catch {
            return null;
          }
        })
        .filter(chat => chat && chat.name && chat.name !== "New Chat");
  
      if (cachedChats.length > 0) {
        setChats(cachedChats);
      }
  
      // Then fetch from server
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${API_URL}/chat/history`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await response.json();
        
        if (data?.chats) {
          setChats(prev => {
            const serverChats = data.chats.filter(chat => 
              chat.name && chat.name !== "New Chat"
            );
            
            // Merge prioritizing server data
            const merged = [...serverChats];
            prev.forEach(localChat => {
              if (!merged.some(chat => chat._id === localChat._id)) {
                merged.push(localChat);
              }
            });
            
            return merged.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
          });
  
          // Set active chat
          if (chatId) {
            const foundChat = data.chats.find(c => c._id === chatId);
            if (foundChat) {
              setActiveChatId(foundChat._id);
              highlightChat(foundChat._id);
            }
          } else if (data.chats.length > 0) {
            setActiveChatId(data.chats[0]._id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      }
    };
  
    loadChats();
  }, [chatId]);

  useEffect(() => {
    chats.forEach(chat => {
      localStorage.setItem(`chat_${chat._id}`, JSON.stringify(chat));
    });
  }, [chats]);
  
  // 🧩 Auto-start AI chat if redirected with a pending prompt
useEffect(() => {
  const pendingPrompt = localStorage.getItem("pendingChatPrompt");
  if (pendingPrompt) {
    console.log("💬 Starting AI Chat with pending prompt:", pendingPrompt);

    const sendPendingPrompt = async () => {
      // If no chats yet, create one
      let chatToUse = chats[0];

      if (!chatToUse) {
        try {
          const API_URL = import.meta.env.VITE_API_URL;
          const res = await fetch(`${API_URL}/chat/createChat`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ name: "New Chat" }),
          });
          const data = await res.json();
          chatToUse = data.chat;
          setChats([chatToUse]);
          setActiveChatId(chatToUse._id);
        } catch (err) {
          console.error("❌ Failed to create chat for pending prompt:", err);
          return;
        }
      } else {
        // ensure active chat
        setActiveChatId(chatToUse._id);
      }

      // Small delay to ensure state updates
      setTimeout(() => {
        setInput(pendingPrompt);
        handleSendMessage(); // 🚀 trigger the send
        localStorage.removeItem("pendingChatPrompt");
      }, 400);
    };

    sendPendingPrompt();
  }
}, [chats]);


  const activeChat = useMemo(() => {
    return chats.find(chat => chat._id === activeChatId) || {
      messages: [],
      typingMessage: "",
      _id: null,
      name: "New Chat"
    };
  }, [chats, activeChatId]);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages, activeChat?.typingMessage]);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(`[data-dropdown]`)) {
        setIsChatDropdownVisible(false);
        setIsMessageDropdownVisible(false);
        setSelectedChatId(null);
        setSelectedMessageId(null);
      }
      
      if (!event.target.closest(`[data-chat-edit]`) && editingChatId) {
        handleChatNameSave(editingChatId);
      }

      // Close sidebar when clicking outside on mobile
      if (isMobile && sidebarOpen && !event.target.closest('.sidebar') && !event.target.closest('.sidebar-toggle')) {
        setSidebarOpen(false);
      }

      // Close header dropdown when clicking outside
      if (headerDropdownOpen && !event.target.closest('.header-dropdown')) {
        setHeaderDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedChatId, selectedMessageId, editingChatId, isMobile, sidebarOpen, headerDropdownOpen]);

  // Chat name editing
  const handleChatNameEdit = (chatId, currentName) => {
    setEditingChatId(chatId);
    setEditedChatName(currentName);
  };

  const handleChatNameSave = async (chatId) => {
    if (!editedChatName.trim()) return;
    
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/chat/${chatId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name: editedChatName }),
      });

      if (!response.ok) throw new Error("Failed to update chat name");

      setChats(prev => 
        prev.map(chat => 
        chat._id === chatId ?
         { ...chat, name: editedChatName } : chat
      ));
    } catch (error) {
      console.error("Error updating chat name:", error);
    }
    setEditingChatId(null);
    setEditedChatName("");
  };

  const downloadChatAsPDF = (chat) => {
    const doc = new jsPDF();
    let yPos = 30;
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
  
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`${t("chat.transcriptPrefix")}: ${chat.name}`, margin, 20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, margin, 28);
    doc.setLineWidth(0.5);
    doc.line(margin, 32, pageWidth - margin, 32);
    yPos = 40;
  
    chat.messages.forEach((msg) => {
      if (yPos > doc.internal.pageSize.getHeight() - 30) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(`${msg.user}:`, margin, yPos);
      yPos += 7;
  
      const plainText = msg.text.replace(/<[^>]+>/g, "");
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(plainText, maxWidth);
      doc.text(lines, margin, yPos);
      yPos += lines.length * 7 + 10;
    });
  
    doc.save(`${chat.name.replace(/[^a-z0-9]/gi, '_')}_transcript.pdf`);
  };

  // Chat management
  const handleNewChat = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const chatName = `Chat ${chats.length + 1}`; 
       const response = await fetch(`${API_URL}/chat/createChat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name: `New Chat ${new Date().toLocaleTimeString()}` }),
      });

      const data = await response.json();
      setChats(prev => [data.chat, ...prev]);
      setActiveChatId(data.chat._id);
      // Close sidebar on mobile after creating new chat
      if (isMobile) {
        setSidebarOpen(false);
        setHeaderDropdownOpen(false);
      }
      localStorage.removeItem(`chat_${data.chat._id}`); 
      setSearchParams({});// clean possible stale cache
      inputRef.current?.focus();
    } catch (error) {
      console.error("Failed to create chat:", error);
    }
  };

  const handleDeleteChat = async (id) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const deleteUrl = `${API_URL}/chat/deleteChat/${id}`;
  
      // console.log("🧭 Deleting chat...");
      // console.log("➡️ Chat ID:", id);
      // console.log("🌍 API URL:", API_URL);
      // console.log("🔗 Full delete URL:", deleteUrl);
  
      const response = await fetch(deleteUrl, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      console.log("📬 Response status:", response.status);
  
      // 🧩 Handle 404 gracefully (chat only in localStorage)
      if (response.status === 404) {
        console.warn("⚠️ Chat not found on server, removing locally:", id);
        localStorage.removeItem(`chat_${id}`);
        setChats((prev) => prev.filter((chat) => chat._id !== id));
  
        if (activeChatId === id) {
          const remainingChats = chats.filter((chat) => chat._id !== id);
          const nextChatId = remainingChats.length > 0 ? remainingChats[0]._id : null;
          setActiveChatId(nextChatId);
        }
  
        toast.info("Chat removed locally (not found on server)");
        return; // exit early
      }
  
      // 🧩 Handle non-OK responses (other than 404)
      if (!response.ok) {
        const text = await response.text();
        console.warn("⚠️ Server responded with error text:", text);
        throw new Error("Failed to delete chat");
      }
  
      console.log("✅ Chat deleted successfully on server");
  
      // 🗑️ Remove from local cache/state
      localStorage.removeItem(`chat_${id}`);
      setChats((prev) => prev.filter((chat) => chat._id !== id));
  
      // 🧭 Update active chat
      if (activeChatId === id) {
        const remainingChats = chats.filter((chat) => chat._id !== id);
        const nextChatId = remainingChats.length > 0 ? remainingChats[0]._id : null;
        setActiveChatId(nextChatId);
      }
  
      toast.success("Chat deleted successfully!");
    } catch (error) {
      console.error("❌ Failed to delete chat:", error);
      toast.error("Failed to delete chat");
    }
  };
  
  
  

  // Message handling
  const handleSendMessage = async () => {
    if (!input.trim() || !activeChatId || loading) return;

    const userMessage = { user: "You", text: input, _id: `temp-${Date.now()}` };
    
    setChats(prev => prev.map(chat =>
      chat._id === activeChatId
        ? {
            ...chat,
            messages: [...chat.messages, userMessage],
            typingMessage: "",
            // 👇 update local name if still default
            name: 
            chat.name === "New Chat" || 
            chat.name.startsWith("New Chat") || 
            chat.name.startsWith("Chat ") && chat.messages.length === 0
              ? input.substring(0, 30) + (input.length > 30 ? "..." : "")
              : chat.name,
        }
      : chat
    ));
  
    setInput("");
    setEditingMessageId(null);
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      console.log("🚀 Sending message to:", `${API_URL}/chat/chat`);
console.log("🧾 Body:", { message: input, chatId: activeChatId });
console.log("🔑 Token:", localStorage.getItem("token"));

       const response = await fetch(`${API_URL}/chat/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ 
          message: input,
          chatId: activeChatId
        }),
      });

      console.log("📬 Response status:", response.status);
      const data = await response.json();
      console.log("📦 Response data:", data);


      slowlyRenderText(data.reply);
    } catch (error) {
      console.error("AI Chat Error:", error);
      setLoading(false);
    }
  };

  // Typewriter effect
  const slowlyRenderText = (fullText) => {
    if (!fullText || typeof fullText !== "string") {
      console.warn("⚠️ No valid AI reply received.");
      setLoading(false);
      toast.error("No valid AI reply received.");
      return;
    }
  
    let i = 0;
    clearInterval(typingInterval.current);
    
    typingInterval.current = setInterval(() => {
      if (i < fullText.length) {
        setChats(prev => 
          prev.map(chat =>
            chat._id === activeChatId
              ? { ...chat, typingMessage: (chat.typingMessage || "") + fullText[i] }
              : chat
          )
        );
        i++;
      } else {
        clearInterval(typingInterval.current);
        finalizeMessage(fullText);
      }
    }, 20);
  };

  useEffect(() => {
    if (editingMessageId && input.trim()) {
      setEditHistory(prev => [...prev, input]);
      setEditIndex(prev => prev + 1);
    }
  }, [input]);
  
  const handleResendEditedMessage = async () => {
    if (!editingMessageId) return;
    
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      await fetch(`${API_URL}/chat/${activeChatId}/message/${editingMessageId}/edit`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ newText: input }),
      });
  
      setEditingMessageId(null);
      setInput("");
      toast.success("Message updated!");
    } catch (error) {
      console.error("Error saving edit:", error);
      toast.error("Failed to update message");
    }
  };
  
  
  const finalizeMessage = (text) => {
    setChats(prev => 
      prev.map(chat =>
      chat._id === activeChatId
        ? {
            ...chat,
            messages: [...chat.messages, { user: "Healthlens Naija", text: formatAIResponse(text), _id: `ai-${Date.now()}` }],
            typingMessage: ""
          }
        : chat
    ));
    setLoading(false);
  };

  const formatAIResponse = (text) => {
    if (!text || typeof text !== "string") {
      return "";
    }
  
    const formattedText = text
      .replace(/\*\*Overview\*\*/g, "</ul><h2 class='font-bold text-xl mt-6 mb-2 text-green-600'>Overview</h2><ul class='list-disc ml-6'>")
      .replace(/\*\*Key Data Points\*\*/g, "</ul><h2 class='font-bold text-xl mt-6 mb-2 text-green-600'>Key Data Points</h2><ul class='list-disc ml-6'>")
      .replace(/\*\*Policy Recommendations\*\*/g, "</ul><h2 class='font-bold text-xl mt-6 mb-2 text-green-600'>Policy Recommendations</h2><ul class='list-disc ml-6'>")
      .replace(/\*\*Challenges & Solutions\*\*/g, "</ul><h2 class='font-bold text-xl mt-6 mb-2 text-green-600'>Challenges & Solutions</h2><ul class='list-disc ml-6'>")
      .replace(/\*\*Challenge\*\*/g, "</li><li class='font-semibold'>Challenge:</li><li>")
      .replace(/\*\*Solution\*\*/g, "</li><li class='font-semibold'>Solution:</li><li>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/- /g, "<li>")
      .replace(/\n/g, "<br/>");
  
    return DOMPurify.sanitize(
      `<ul class='list-disc ml-6 space-y-2'>${formattedText}</ul>`
    );
  };
  

  // Render elements
  const renderChatTab = (chat) => {
    const isActive = chat._id === activeChatId;
    const isEditing = editingChatId === chat._id;

    const displayName = chat.name && !chat.name.startsWith("New Chat") 
    ? chat.name 
    : `Chat ${chats.indexOf(chat) + 1}`;
  
    
    return (
      <div
        id={`chat-${chat._id}`}
        key={chat._id}
        className={`relative flex items-center min-w-0 group rounded-lg transition-all duration-200 ${
          isActive
            ? isNightMode 
              ? "bg-gray-700 text-white" 
              : "bg-gray-100 text-gray-900"
            : isNightMode 
              ? "bg-gray-800 text-gray-300 hover:bg-gray-700" 
              : "bg-white hover:bg-gray-50"
        }`}
      >
        <div 
          className="flex-1 min-w-0 py-3 px-4 cursor-pointer truncate"
          onClick={() => {
            if (!isEditing) {
              setActiveChatId(chat._id);
              if (isMobile) {
                setSidebarOpen(false);
                setHeaderDropdownOpen(false);
              }
            }
          }}
        >
          {isEditing ? (
            <input
              data-chat-edit
              type="text"
              value={editedChatName}
              onChange={(e) => setEditedChatName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleChatNameSave(chat._id)}
              className="bg-transparent outline-none w-full"
              autoFocus
            />
          ) : (
            <span
  className="truncate block"
  title={chat.name} // shows full name on hover
>
  {chat.name.length > 28 ? `${chat.name.slice(0, 28)}…` : chat.name}
</span>

          )}
        </div>

        <div className="flex items-center pr-2 space-x-1">
          {!isEditing && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleChatNameEdit(chat._id, chat.name);
              }}
              className={`p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
                isNightMode 
                  ? "text-gray-400 hover:text-white hover:bg-gray-600" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
              }`}
            >
              <PencilIcon className="h-4 w-4" />
            </button>
          )}
          
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedChatId(chat._id);
                setIsChatDropdownVisible(!isChatDropdownVisible);
              }}
              className={`p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
                isNightMode 
                  ? "text-gray-400 hover:text-white hover:bg-gray-600" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
              }`}
            >
              <EllipsisVerticalIcon className="h-4 w-4" />
            </button>
            
            {selectedChatId === chat._id && isChatDropdownVisible && (
  <div
    data-dropdown
    className={`absolute right-0 mt-1 w-48 rounded-md shadow-lg z-10 ${
      isNightMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
    }`}
  >
    <div className="py-1">
      <button
        onClick={(e) => {
          e.stopPropagation();
          downloadChatAsPDF(chat);
          setIsChatDropdownVisible(false);
        }}
        className={`flex items-center w-full text-left px-4 py-2 ${
          isNightMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
        }`}
      >
        <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
        {t("chat.downloadPdf")}
      </button>
    </div>
  </div>
)}

          </div>
          
          {chats.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteChat(chat._id);
              }}
              className={`p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
                isNightMode 
                  ? "text-red-400 hover:text-red-300 hover:bg-gray-600" 
                  : "text-red-500 hover:text-red-700 hover:bg-gray-200"
              }`}
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      hideProgressBar
      newestOnTop={false}
      closeOnClick
      pauseOnFocusLoss={false}
      draggable
      pauseOnHover
      theme={isNightMode ? "dark" : "light"}
    />
  {/* 🆕 NEW: Back to Stories button */}
  <div className="mb-4 p-4 border-b border-gray-300 dark:border-gray-600">
      <button 
        onClick={() => navigate('/generate-story')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          isNightMode 
            ? "bg-gray-700 hover:bg-gray-600 text-white" 
            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
        }`}
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Stories
      </button>
    </div>
    <div className={`flex h-screen overflow-hidden ${isNightMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      {/* Mobile header */}
      {isMobile && (
        <div className={`fixed top-0 left-0 right-0 z-30 p-4 border-b flex justify-between items-center ${
          isNightMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
        }`}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-lg sidebar-toggle ${
              isNightMode 
                ? "bg-gray-700 hover:bg-gray-600 text-white" 
                : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-300"
            } transition-colors`}
          >
            {sidebarOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
          </button>
          
          {/* Clickable header title with dropdown */}
          <div className="relative header-dropdown flex-1 mx-4">
            <button
              onClick={() => setHeaderDropdownOpen(!headerDropdownOpen)}
              className="flex items-center justify-between w-full px-4 py-2 rounded-lg text-left"
            >
              <span className="text-lg font-semibold truncate max-w-xs">
              {activeChat?.name || t("chat.newChat")}
              </span>
              <ChevronDownIcon className={`h-5 w-5 transition-transform ${headerDropdownOpen ? 'transform rotate-180' : ''}`} />
            </button>
            
            {headerDropdownOpen && (
  <div
    className={`absolute top-full left-0 right-0 mt-2 rounded-lg shadow-lg z-40 max-h-72 overflow-y-auto ${
      isNightMode
        ? "bg-gray-800 border border-gray-700"
        : "bg-white border border-gray-200"
    }`}
  >
    <div className="py-2">
      {chats.map((chat) => (
        <div
          key={chat._id}
          className={`px-4 py-2 flex items-center justify-between ${
            chat._id === activeChatId
              ? isNightMode
                ? "bg-gray-700 text-white"
                : "bg-gray-100 text-gray-900"
              : isNightMode
              ? "hover:bg-gray-700"
              : "hover:bg-gray-100"
          }`}
        >
          {/* Chat Name */}
          <div
            className="truncate flex-1"
            onClick={() => {
              setActiveChatId(chat._id);
              setHeaderDropdownOpen(false);
            }}
          >
            {chat.name.length > 28
              ? `${chat.name.slice(0, 28)}…`
              : chat.name}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 ml-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleChatNameEdit(chat._id, chat.name);
                setHeaderDropdownOpen(false);
              }}
              className={`p-1 rounded-full ${
                isNightMode
                  ? "text-gray-400 hover:text-white hover:bg-gray-600"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
              }`}
            >
              <PencilIcon className="h-4 w-4" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteChat(chat._id);
                setHeaderDropdownOpen(false);
              }}
              className={`p-1 rounded-full ${
                isNightMode
                  ? "text-red-400 hover:text-red-300 hover:bg-gray-600"
                  : "text-red-500 hover:text-red-700 hover:bg-gray-200"
              }`}
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}

      {/* Start New Chat */}
      <div
        className={`px-4 py-2 cursor-pointer border-t ${
          isNightMode
            ? "border-gray-700 hover:bg-gray-700"
            : "border-gray-200 hover:bg-gray-100"
        }`}
        onClick={() => {
          handleNewChat();
          setHeaderDropdownOpen(false);
        }}
      >
        <div className="flex items-center">
          <PlusIcon className="h-4 w-4 mr-2" />
          {t("chat.startNew")}
        </div>
      </div>
    </div>
  </div>
)}

          </div>
          
          <button
            onClick={handleNewChat}
            className={`p-2 rounded-lg ${
              isNightMode 
                ? "bg-gray-700 hover:bg-gray-600 text-white" 
                : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-300"
            } transition-colors`}
          >
            <PlusIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Sidebar with chat tabs */}
      <div className={`sidebar w-64 flex-shrink-0 border-r transition-transform duration-300 ${
        isMobile 
          ? `fixed top-0 left-0 bottom-0 z-20 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
          : 'relative'
      } ${
        isNightMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
      }`}>
        <div className={`p-4 border-b ${isMobile ? 'pt-16' : ''} ${
          isNightMode ? "border-gray-700" : "border-gray-200"
        }`}>
          <h2 className="text-lg font-semibold">{t("chat.history")}</h2>
          {!isMobile && (
            <button
              onClick={handleNewChat}
              className={`mt-2 p-2 rounded-lg ${
                isNightMode 
                  ? "bg-gray-700 hover:bg-gray-600 text-white" 
                  : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-300"
              } transition-colors`}
            >
              <PlusIcon className="h-5 w-5" />
            </button>
          )}
        </div>
        
        <div className="p-2 space-y-1 overflow-y-auto h-[calc(100vh-65px)]">
          {chats.map(renderChatTab)}
        </div>
      </div>

      {/* Main chat area */}
      <div className={`flex-1 flex flex-col overflow-hidden ${isMobile ? 'pt-16' : ''}`}>
        {/* Desktop chat header */}
        {!isMobile && (
          <div className={`p-4 border-b ${
            isNightMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
          }`}>
            <h1 className="text-lg font-semibold truncate">
            {activeChat?.name || t("chat.newChat")}
            </h1>
          </div>
        )}

        {/* Messages container */}
        <div className={`flex-1 overflow-y-auto ${
          isNightMode ? "bg-gray-900" : "bg-gray-50"
        }`}>
          <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
            {(activeChat?.messages ?? []).length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className={`p-4 rounded-full mb-4 ${
                  isNightMode ? "bg-gray-800 text-green-400" : "bg-gray-100 text-green-500"
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold mb-2">
    {isNightMode
      ? t("chat.greeting")
      : t("chat.startConversation")}
  </h2>
                <p className={`max-w-md ${isNightMode ? "text-gray-400" : "text-gray-500"}`}>
                {t("chat.emptyHelper")}
                </p>
              </div>
            )}

            {(activeChat?.messages ?? []).map((msg) => (
              <div
                key={msg._id}
                className={`group relative ${
                  msg.user === "You" ? "flex justify-end" : "flex justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] lg:max-w-[75%] rounded-xl relative ${
                    msg.user === "You"
                      ? isNightMode
                        ? "bg-green-600 text-white"
                        : "bg-green-500 text-white"
                      : isNightMode
                        ? "bg-gray-800 text-gray-100"
                        : "bg-white text-gray-800 border border-gray-200"
                  }`}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <strong className="text-sm font-medium">
                      {msg.user === "You" ? "You" : t("chat.assistantName")}
                      </strong>
                      {(msg.user === "Healthlens Naija" || msg.user === "You") && (
  <div className="relative ml-2">
    <button
      onClick={() => {
        setSelectedMessageId(msg._id);
        setIsMessageDropdownVisible(!isMessageDropdownVisible);
      }}
      className={`p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
        isNightMode
          ? "text-gray-400 hover:text-white hover:bg-gray-700"
          : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
      }`}
    >
      <EllipsisVerticalIcon className="h-4 w-4" />
    </button>

    {selectedMessageId === msg._id && isMessageDropdownVisible && (
      <div
        data-dropdown
        className={`absolute right-0 mt-1 w-48 rounded-md shadow-lg z-10 ${
          isNightMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
        }`}
      >
        <div className="py-1">
  {/* ✅ Copy only */}
  <button
    onClick={() => {
      navigator.clipboard.writeText(msg.text.replace(/<[^>]+>/g, ''));
      toast.success("Copied!");
      setIsMessageDropdownVisible(false);
    }}
    className={`flex items-center w-full text-left px-4 py-2 ${
      isNightMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
    }`}
  >
    <span className="h-4 w-4 mr-2">📋</span>
    {t("chat.copyMessage")}
  </button>

  {/* ✅ Copy & Edit (new button) */}
  <button
    onClick={() => {
      const cleanText = msg.text.replace(/<[^>]+>/g, '');
      setInput(cleanText);
      setEditingMessageId(msg._id);
      toast.info("Copied to input — edit and resend when ready.");
      setIsMessageDropdownVisible(false);
      inputRef.current?.focus();
    }}
    className={`flex items-center w-full text-left px-4 py-2 ${
      isNightMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
    }`}
  >
    ✏️
    <span className="ml-2">{t("chat.copyAndEdit") || "Copy & Edit"}</span>
  </button>

  {/* ✅ Edit & Resend (for user messages) */}
  {msg.user === "You" && (
    <button
      onClick={() => {
        setInput(msg.text.replace(/<[^>]+>/g, ''));
        setEditingMessageId(msg._id);
        setIsMessageDropdownVisible(false);
        inputRef.current?.focus();
      }}
      className={`flex items-center w-full text-left px-4 py-2 ${
        isNightMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
      }`}
    >
      <PencilIcon className="h-4 w-4 mr-2" />
      {t("chat.editResend")}
    </button>
  )}

  {/* ✅ Optional: View Edit History (if you add edit tracking in schema) */}
  {msg.edits && msg.edits.length > 0 && (
    <button
      onClick={() => {
        const history = msg.edits.map((e, i) => `${i + 1}. ${e.text}`).join("\n\n");
        alert(`Previous versions:\n\n${history}`);
        setIsMessageDropdownVisible(false);
      }}
      className={`flex items-center w-full text-left px-4 py-2 ${
        isNightMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
      }`}
    >
      <span className="h-4 w-4 mr-2">🕓</span>
      {t("chat.viewEditHistory") || "View Edit History"}
    </button>
  )}
</div>
      </div>
    )}
  </div>
)}

                    </div>
                    <div
                      className={`prose max-w-none ${
                        isNightMode ? "prose-invert" : ""
                      }`}
                      dangerouslySetInnerHTML={{ __html: formatAIResponse(msg.text) }}
                    />
                  </div>
                </div>
              </div>
            ))}
            
            {activeChat.typingMessage && (
              <div className="flex justify-start">
                <div className={`max-w-[85%] lg:max-w-[75%] rounded-xl relative ${
                  isNightMode ? "bg-gray-800" : "bg-white border border-gray-200"
                }`}>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <strong className="text-sm font-medium">Healthlens Naija Assistant</strong>
                    </div>
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <div className="flex space-x-1">
                        <div className={`w-2 h-2 rounded-full ${
                          isNightMode ? "bg-gray-500" : "bg-gray-400"
                        } animate-bounce`} style={{ animationDelay: '0ms' }}></div>
                        <div className={`w-2 h-2 rounded-full ${
                          isNightMode ? "bg-gray-500" : "bg-gray-400"
                        } animate-bounce`} style={{ animationDelay: '150ms' }}></div>
                        <div className={`w-2 h-2 rounded-full ${
                          isNightMode ? "bg-gray-500" : "bg-gray-400"
                        } animate-bounce`} style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                    <div
                      className={`prose max-w-none ${
                        isNightMode ? "prose-invert" : ""
                      }`}
                      dangerouslySetInnerHTML={{ __html: formatAIResponse(activeChat.typingMessage) }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <div className={`p-4 border-t ${
          isNightMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
        }`}>
          <div className="max-w-4xl mx-auto">
          {/* Add this loading indicator above the input */}
    {loading && !activeChat.typingMessage && (
      <div className="flex justify-center mb-2">
        <div className={`flex space-x-1 items-center px-3 py-1 rounded-full ${
          isNightMode ? "bg-gray-700" : "bg-gray-100"
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            isNightMode ? "bg-green-400" : "bg-green-500"
          } animate-bounce`} style={{ animationDelay: '0ms' }}></div>
          <div className={`w-2 h-2 rounded-full ${
            isNightMode ? "bg-green-400" : "bg-green-500"
          } animate-bounce`} style={{ animationDelay: '150ms' }}></div>
          <div className={`w-2 h-2 rounded-full ${
            isNightMode ? "bg-green-400" : "bg-green-500"
          } animate-bounce`} style={{ animationDelay: '300ms' }}></div>
          <span className={`ml-2 text-sm ${
            isNightMode ? "text-gray-300" : "text-gray-600"
          }`}>{t("chat.processing")}</span>
        </div>
      </div>
    )}

    {editingMessageId && (
  <div className="flex justify-between text-sm mt-2">
    <button
      disabled={editIndex <= 0}
      onClick={() => {
        const newIndex = Math.max(0, editIndex - 1);
        setInput(editHistory[newIndex]);
        setEditIndex(newIndex);
      }}
      className="text-gray-400 hover:text-gray-700"
    >
      ← Back
    </button>
    <button
      disabled={editIndex >= editHistory.length - 1}
      onClick={() => {
        const newIndex = Math.min(editHistory.length - 1, editIndex + 1);
        setInput(editHistory[newIndex]);
        setEditIndex(newIndex);
      }}
      className="text-gray-400 hover:text-gray-700"
    >
      Forward →
    </button>
  </div>
)}

            <div className={`flex items-end gap-2 rounded-xl p-3 ${
              isNightMode ? "bg-gray-700" : "bg-gray-100"
            }`}>
              <div className="flex-1">
                <textarea
                  ref={inputRef}
                  rows="2"
                  placeholder="Message Healthlens Naija."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className={`w-full bg-transparent outline-none resize-none max-h-32 ${
                    isNightMode ? "text-gray-200 placeholder-gray-400" : "text-gray-800 placeholder-gray-500"
                  }`}
                  disabled={loading}
                />
              </div>
              <div className="flex gap-1">
                {activeChat.typingMessage && (
                  <button
                    onClick={() => {
                      clearInterval(typingInterval.current);
                      finalizeMessage(activeChat.typingMessage);
                    }}
                    className={`p-2 rounded-lg ${
                      isNightMode 
                        ? "text-red-400 hover:bg-gray-600" 
                        : "text-red-500 hover:bg-gray-200"
                    }`}
                  >
                    <StopCircleIcon className="h-5 w-5" />
                  </button>
                )}
                <button
  onClick={handleSendMessage}
  disabled={!input.trim() || loading}
  className={`p-2 rounded-lg relative ${
    (!input.trim() || loading)
      ? isNightMode
        ? "bg-gray-600 text-gray-400"
        : "bg-gray-300 text-gray-500"
      : isNightMode
        ? "bg-green-600 hover:bg-green-500 text-white"
        : "bg-green-500 hover:bg-green-600 text-white"
  } transition-colors`}
>
  {loading ? (
    <div className="flex items-center justify-center">
      <div className="flex space-x-1">
        <div className={`w-2 h-2 rounded-full ${
          isNightMode ? "bg-green-200" : "bg-white"
        } animate-bounce`} style={{ animationDelay: '0ms' }}></div>
        <div className={`w-2 h-2 rounded-full ${
          isNightMode ? "bg-green-200" : "bg-white"
        } animate-bounce`} style={{ animationDelay: '150ms' }}></div>
        <div className={`w-2 h-2 rounded-full ${
          isNightMode ? "bg-green-200" : "bg-white"
        } animate-bounce`} style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  ) : (
    <PaperAirplaneIcon className="h-5 w-5" />
  )}
</button>
              </div>
            </div>
            <p className={`text-xs mt-2 text-center ${
              isNightMode ? "text-gray-500" : "text-gray-400"
            }`}>
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default AIChat;

