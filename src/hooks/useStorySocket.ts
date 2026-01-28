import { useEffect } from "react";
import { io } from "socket.io-client";

export const useStorySocket = (userId, onStoryUpdated) => {
  useEffect(() => {
    if (!userId) return;
    const socket = io(import.meta.env.VITE_API_URL.replace("/api", ""), {
      transports: ["websocket"],
      auth: { token: localStorage.getItem("token") },
    });

    socket.on("connect", () => console.log("⚡️Connected to story socket"));
    socket.emit("join", userId); // backend already joins userId room

    socket.on("story:updated", ({ storyId }) => {
      console.log("📩 story updated:", storyId);
      onStoryUpdated?.(storyId);
    });

    return () => socket.disconnect();
  }, [userId, onStoryUpdated]);
};
