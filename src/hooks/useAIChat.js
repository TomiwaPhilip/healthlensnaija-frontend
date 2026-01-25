import { useState, useEffect, useRef } from "react";

export const useAIChat = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const typingRef = useRef(null);

  // 🔹 Load cached chats
  useEffect(() => {
    const cached = Object.keys(localStorage)
      .filter(k => k.startsWith("chat_"))
      .map(k => JSON.parse(localStorage.getItem(k)));
    if (cached.length > 0) {
      setChats(cached);
      setActiveChatId(cached[0]._id);
      setMessages(cached[0].messages || []);
    }
  }, []);

  // 🔹 Save cache
  useEffect(() => {
    chats.forEach(chat => {
      localStorage.setItem(`chat_${chat._id}`, JSON.stringify(chat));
    });
  }, [chats]);

  const handleNewChat = async () => {
    const res = await fetch(`${API_URL}/chat/createChat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name: `Chat ${new Date().toLocaleTimeString()}` }),
    });
    const data = await res.json();
    const newChat = data.chat;
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat._id);
    setMessages([]);
  };

  const handleSendMessage = async (input) => {
    if (!input.trim() || !activeChatId) return;
    const userMessage = { user: "You", text: input, _id: `temp-${Date.now()}` };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/chat/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ message: input, chatId: activeChatId }),
      });

      const data = await res.json();
      const aiReply = data.reply;
      let i = 0;
      clearInterval(typingRef.current);
      let partial = "";
      typingRef.current = setInterval(() => {
        if (i < aiReply.length) {
          partial += aiReply[i++];
          setMessages(prev => {
            const newMsgs = [...prev];
            newMsgs[newMsgs.length - 1] = { ...userMessage };
            return [...newMsgs, { user: "AI", text: partial }];
          });
        } else {
          clearInterval(typingRef.current);
          setLoading(false);
        }
      }, 20);
    } catch (err) {
      console.error("Chat send error", err);
      setLoading(false);
    }
  };

  return {
    chats,
    activeChatId,
    setActiveChatId,
    messages,
    handleSendMessage,
    handleNewChat,
    loading
  };
};
