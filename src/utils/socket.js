// src/utils/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const makeSocket = (chatId) => {
  const socket = io(SOCKET_URL, {
    transports: ["websocket", "polling"], // allow fallback
    withCredentials: true,
    path: "/socket.io",                   // must stay at root
    query: {
      role: "Admin",                      // 👈 always identify as Admin
      ...(chatId ? { chatId } : {}),      // also include chatId if provided
    },
  });

  // Debugging
  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id, "room:", chatId || "—");
  });
  socket.on("connect_error", (err) => {
    console.error("❌ Socket connect_error:", err.message, err);
  });
  socket.on("disconnect", (reason) => {
    console.warn("⚠️ Socket disconnected:", reason);
  });

  return socket;
};
