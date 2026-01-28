// pages/Dashboard/generateStory.jsx
import React, { useState, useContext, useEffect, useRef } from "react";
import { useWebSpeechRecognition } from "../../hooks/useWebSpeechRecognition";
import { DashboardContext } from "../../context/DashboardContext";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import AngleSelection from "../../components/generate/Story/AngleSelection";
import PromptInputTour from "../../components/generate/Form/PromptInputTour";
import UploadTab from "../../components/Dashboard/UploadTab";
import AIChatTab from "../../components/Dashboard/AIChatTab";

import moment from "moment";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Import refactored components
import PromptInput from "../../components/generate/Form/PromptInput";
import StoryList from "../../components/generate/Story/StoryList";
import VoiceModal from "../../components/generate/Modals/VoiceModal";
import DeleteModal from "../../components/generate/Modals/DeleteModal";
import LoadingOverlay from "../../components/generate/Modals/LoadingOverlay";

// Import utility functions
import { formatStoryContent } from "../../utils/formatStoryContent";
import { exportStoryPDF } from "../../utils/exportStoryPDF";
import StorySettingsForm, {
  toneMapReverse,
} from "../../components/common/StorySettingsForm";

const GenerateStory = () => {
  const { isNightMode } = useContext(DashboardContext);
  const [searchParams] = useSearchParams();
  const storyId = searchParams.get("storyId");
  const navigate = useNavigate();
  const [loadingRecs, setLoadingRecs] = useState({});
  const { t } = useTranslation("story");
  const API_URL = import.meta.env.VITE_API_URL;
  const topRef = useRef(null);

  // 🆕 CORRECTED: Handle chat message sending
  const handleSendMessage = async () => {
    if (!prompt.trim()) return;
    
    // The actual sending will be handled by AIChatTab
    // We just pass the prompt and let AIChatTab handle the API call
    console.log("Chat message ready to send:", prompt);
    // Let AIChatTab handle the actual sending and input clearing
  };

  // 🆕 NEW: Content mode state - replaces tabs
  const [contentMode, setContentMode] = useState("stories"); // "stories" | "chat" | "upload"

  // Speech recognition hook
  const {
    transcript: modalTranscript,
    listening,
    supported: speechSupported,
    start: startListening,
    stop: stopListening,
  } = useWebSpeechRecognition({
    lang: "en-US",
    continuous: true,
    interimResults: true,
  });

  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  useEffect(() => {
    const savedDraft = localStorage.getItem("pendingStoryDraft");
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setGeneratedStoryId(parsed.storyId);
        setGeneratedAngles(parsed.angles || []);
        setShowAngleSelection(true);
      } catch (err) {
        console.warn("Invalid saved draft:", err);
      }
    }
  }, []);

  useEffect(() => {
    const fetchPendingDraft = async () => {
      try {
        const res = await fetch(`${API_URL}/generate-story/pending`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (data?.pending?.length > 0) {
          const latest = data.pending[0];
          setGeneratedStoryId(latest.storyId);
          setGeneratedAngles(latest.angles || []);
          setShowAngleSelection(true);
          console.log("🟡 Restored pending draft:", latest.storyId);
        }
      } catch (err) {
        console.error("Failed to fetch pending story:", err);
      }
    };
  
    fetchPendingDraft();
  }, []);
  
  useEffect(() => {
    if (isVoiceModalOpen) {
      setPrompt(modalTranscript);
    }
  }, [modalTranscript, isVoiceModalOpen]);

  useEffect(() => {
    if (!isVoiceModalOpen && modalTranscript) {
      setPrompt(modalTranscript);
    }
  }, [isVoiceModalOpen, modalTranscript]);

  // Define the Four-Point Agenda Pillars and their Keywords
  const pillarData = {
    "Effective Governance": {
      keywords: [
        "Sector Wide Approach (SWAp)",
        "National Health Act",
        "Accountability",
        "Transparency",
        "Regulatory Capacity",
        "Regulation",
        "Coordination",
        "Partnership",
        "Federal-State Partnership",
        "Public-private partnership (PPP)",
        "Defragmenting Sector Financing",
        "Multisectoral",
        "Private sector",
        "Implementing partners",
      ],
    },
    "Efficient, Equitable, and Quality Health System": {
      keywords: [
        "Universal Health Coverage (UHC)",
        "Primary Health Care (PHC)",
        "Nigeria Health Sector Renewal Investment Initiative",
        "Basic Healthcare Provision Fund (BHCPF)",
        "Vulnerable Group Fund",
        "Medical and Public Health Emergency Fund",
        "National Health Insurance Act",
        "Healthcare Industrialisation Program",
        "Community-based health services",
        "Quality of care",
        "Secondary care",
        "Tertiary care",
        "Equity",
        "Equitable",
        "Affordable",
        "Health financing",
        "Digital health",
        "Health data systems",
        "Health data management",
        "Telemedicine",
        "Healthcare Workforce",
        "Human resources for health",
        "Maternal Health",
      ],
    },
    "Unlocking Value Chains": {
      keywords: [
        "Presidential Taskforce for Unlocking the Value Chain (PVAC)",
        "Research and Development (R&D)",
        "Pre-qualification",
        "Local manufacturing",
        "Local production",
        "Demand creation",
        "Sustainable local demand",
        "Strengthen supply chain",
        "Distribution",
        "Logistics",
        "Biotechnology",
        "Health financing",
        "Innovation",
        "Vaccination",
        "Immunisation",
        "Vaccine access",
        "Vaccine supply",
        "Vaccine hesitancy",
        "Vaccine acceptance",
        "Vaccine uptake",
        "Local capacity",
        "Maternal newborn and child health (MNCH)",
      ],
    },
    "Health Security": {
      keywords: [
        "Health Security",
        "Epidemic Preparedness and Response (EPR)",
        "Prepare",
        "Detect",
        "Respond",
        "Preparedness",
        "Response",
        "Outbreaks",
        "Epidemics",
        "Surveillance",
        "Climate Change",
        "Climate Resilience",
        "Resilience",
        "One Health",
        "Health promotion",
        "Risk communication",
        "Community engagement",
        "Crisis management",
        "7-1-7",
        "International Health Regulation (IHR)",
        "Joint External Evaluation",
        "Water and Sanitation Hygiene (WASH)",
        "Capacity building",
      ],
    },
  };

  // State Management
  const [selectedPillar, setSelectedPillar] = useState("");
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [keywordSearch, setKeywordSearch] = useState("");
  const [isPillarDropdownOpen, setIsPillarDropdownOpen] = useState(false);
  const [isKeywordDropdownOpen, setIsKeywordDropdownOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [storyText, setStoryText] = useState("");
  const [generatedStoryId, setGeneratedStoryId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [storyToDelete, setStoryToDelete] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);
  const [progress, setProgress] = useState(0);
  const [recommendationsMap, setRecommendationsMap] = useState({});
  const [generatedAngles, setGeneratedAngles] = useState([]);
  const [showAngleSelection, setShowAngleSelection] = useState(false);

  // 🆕 NEW: State for chats and combined items
  const [chats, setChats] = useState([]);
  const [combinedItems, setCombinedItems] = useState([]); // Stories + Chats combined

  const handleSelectAngle = async (selectedIndex) => {
    try {
      const res = await fetch(`${API_URL}/generate-story/select`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ storyId: generatedStoryId, selectedIndex }),
      });
      if (!res.ok) throw new Error("Failed to select angle");
  
      const chosenAngle = generatedAngles[selectedIndex];
      const instantStory = {
        _id: generatedStoryId,
        title: chosenAngle?.title || "Untitled Story",
        content: chosenAngle?.content || "(Loading enriched content…)",
        quickInsights: chosenAngle?.keyPoints?.join("\n") || "",
        angles: generatedAngles,
        selectedIndex,
        status: "enriched",
        createdAt: new Date().toISOString(),
      };
  
      setStories((prev) => {
        const exists = prev.some((s) => s._id === instantStory._id);
        if (exists) {
          return prev.map((s) => (s._id === instantStory._id ? instantStory : s));
        }
        return [instantStory, ...prev];
      });
  
      setShowAngleSelection(false);
      setGeneratedAngles([]);
      localStorage.removeItem("pendingStoryDraft");
  
      setToast({
        open: true,
        message: "✅ Story generated successfully!",
        severity: "success",
      });

      setTimeout(() => {
        if (topRef.current) {
          topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 400);
  
      fetch(`${API_URL}/generate-story/${generatedStoryId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then(async (fetchRes) => {
          if (!fetchRes.ok) throw new Error("Failed to load enriched story");
          const storyData = await fetchRes.json();
  
          setStories((prev) => {
            const exists = prev.some((s) => s._id === storyData._id);
            if (exists) {
              return prev.map((s) => (s._id === storyData._id ? storyData : s));
            }
            return [storyData, ...prev];
          });
  
          await fetch(`${API_URL}/generate-story/${generatedStoryId}/mark-used`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
        })
        .catch((err) => {
          console.warn("⚠️ Background fetch failed:", err);
        });
  
    } catch (err) {
      console.error("❌ Error selecting angle:", err);
      setToast({
        open: true,
        message: err.message || "Failed to load story",
        severity: "error",
      });
    }
  };

  const pillarDropdownRef = useRef(null);
  const keywordDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        pillarDropdownRef.current &&
        !pillarDropdownRef.current.contains(event.target)
      ) {
        setIsPillarDropdownOpen(false);
      }
      if (
        keywordDropdownRef.current &&
        !keywordDropdownRef.current.contains(event.target)
      ) {
        setIsKeywordDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "English"
  );
  const [tone, setTone] = useState(localStorage.getItem("tone") || "Neutral");

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);
  useEffect(() => {
    localStorage.setItem("tone", tone);
  }, [tone]);

  const length = localStorage.getItem("length") || "medium";
  const storiesPerPage = 5;

  const openVoiceModal = () => {
    setIsVoiceModalOpen(true);
  };

  const closeVoiceModal = () => {
    setIsVoiceModalOpen(false);
    if (listening) stopListening();
  };

  const applyVoiceInput = () => {
    setPrompt(modalTranscript);
    closeVoiceModal();
  };

  const fetchRecommendations = async (storyId) => {
    setLoadingRecs((prev) => ({ ...prev, [storyId]: true }));
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_URL}/stories/${storyId}/recommendations`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setRecommendationsMap((prev) => ({
        ...prev,
        [storyId]: data.recommendations || [],
      }));
    } catch (err) {
      console.error("Failed to load recommendations", err);
    } finally {
      setLoadingRecs((prev) => ({ ...prev, [storyId]: false }));
    }
  };

  useEffect(() => {
    stories.forEach((story) => {
      if (story._id === generatedStoryId) return;
      fetchRecommendations(story._id);
    });
  }, [stories, generatedStoryId]);

  useEffect(() => {
    if (loading) {
      let frame = 0;
      const step = () => {
        frame += 1;
        if (frame % 6 === 0) setProgress((p) => (p >= 95 ? 95 : p + 1));
        if (loading) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    } else {
      setProgress(0);
    }
  }, [loading]);

  // 🆕 NEW: Function to fetch chats
  const fetchChats = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/chat/history`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (data?.chats) {
        setChats(data.chats);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  // 🆕 NEW: Function to combine stories and chats
  const combineStoriesAndChats = (storiesList, chatsList) => {
    const storyItems = storiesList.map(story => ({
      ...story,
      type: 'story',
      displayDate: story.createdAt || story.updatedAt
    }));

    const chatItems = chatsList.map(chat => ({
      ...chat,
      type: 'chat',
      displayDate: chat.createdAt || chat.updatedAt,
      // Add any additional properties needed for display
      title: chat.name || 'Chat Conversation',
      content: chat.messages?.[chat.messages.length - 1]?.text || 'No messages yet'
    }));

    // Combine and sort by date (newest first)
    return [...storyItems, ...chatItems].sort((a, b) => 
      new Date(b.displayDate) - new Date(a.displayDate)
    );
  };

  // 🆕 NEW: Handler for chat item clicks
  const handleChatClick = (chatId) => {
    navigate(`/ai-chat?chatId=${chatId}`);
  };

  // 🆕 UPDATED: Fetch both stories and chats
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stories (existing code)
        const cachedStories = localStorage.getItem("storiesCache");
        if (cachedStories) {
          setStories(JSON.parse(cachedStories));
        }

        const API_URL = import.meta.env.VITE_API_URL;
        const storiesResponse = await fetch(`${API_URL}/stories`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const storiesData = await storiesResponse.json();
        setStories(storiesData);
        localStorage.setItem("storiesCache", JSON.stringify(storiesData));

        // Fetch chats (new)
        await fetchChats();

        if (storyId) {
          const foundStory = storiesData.find((story) => story._id === storyId);
          if (foundStory) {
            setTimeout(() => {
              const storyElement = document.getElementById(`story-${storyId}`);
              if (storyElement) {
                storyElement.scrollIntoView({ behavior: "smooth", block: "start" });
                storyElement.classList.add("bg-yellow-200");
                setTimeout(
                  () => storyElement.classList.remove("bg-yellow-200"),
                  2000
                );
              }
            }, 200);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [storyId]);

  // 🆕 NEW: Combine items when stories or chats change
  useEffect(() => {
    const combined = combineStoriesAndChats(stories, chats);
    setCombinedItems(combined);
  }, [stories, chats]);

  const handleContinueDiscussion = async (story) => {
    let chatId = story.linkedChatId;
    const API_URL = import.meta.env.VITE_API_URL;

    let chatExists = false;
    if (chatId) {
      try {
        const verifyRes = await fetch(`${API_URL}/chat/${chatId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        chatExists = verifyRes.ok;
      } catch {
        chatExists = false;
      }
    }

    if (!chatId || !chatExists) {
      console.log("🧱 Old chat missing or deleted, creating new link...");
      const res = await fetch(`${API_URL}/stories/${story._id}/linkChat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      chatId = data.linkedChatId;

      setStories((prev) =>
        prev.map((s) =>
          s._id === story._id ? { ...s, linkedChatId: chatId } : s
        )
      );
    }

    const storyTitle = story.title || "Untitled Story";
    const shortTitle =
      storyTitle.length > 35
        ? storyTitle.slice(0, 35).trim() + "…"
        : storyTitle;
    const chatName = `Story: ${shortTitle}`;

    const chatCacheKey = `chat_${chatId}`;
    const initialChat = {
      _id: chatId,
      name: chatName,
      linkedStoryId: story._id,
      createdAt: new Date().toISOString(),
      messages: [
        {
          user: "system",
          text: story.content,
          timestamp: new Date().toISOString(),
          _id: `init-${chatId}`,
        },
      ],
    };

    localStorage.setItem(chatCacheKey, JSON.stringify(initialChat));
    navigate(`/ai-chat?chatId=${chatId}`);
  };

  useEffect(() => {
    if (storyId) {
      const fetchStory = async () => {
        try {
          const API_URL = import.meta.env.VITE_API_URL;
          const response = await fetch(`${API_URL}/stories/${storyId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          const data = await response.json();
          setSelectedStory(data);

          const storyElement = document.getElementById(`story-${storyId}`);
          if (storyElement) {
            storyElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
            storyElement.classList.add("bg-yellow-200");
            setTimeout(
              () => storyElement.classList.remove("bg-yellow-200"),
              2000
            );
          }
        } catch (error) {
          console.error("Error fetching story:", error);
        }
      };
      fetchStory();
    }
  }, [storyId]);

  // Handle Pillar Selection
  const handlePillarChange = (pillar) => {
    setSelectedPillar(pillar);
    setSelectedKeywords([]);
    setIsPillarDropdownOpen(false);
  };

  // Handle Keyword Selection
  const handleKeywordChange = (keyword) => {
    setSelectedKeywords((prev) =>
      prev.includes(keyword)
        ? prev.filter((k) => k !== keyword)
        : [...prev, keyword]
    );
  };

  // 🆕 UPDATED: Handle Story Generation with mode detection
  const handleGenerate = async () => {
    // 🆕 If we're already in chat mode, don't auto-switch
    if (contentMode === "chat") {
      // In chat mode, handleGenerate shouldn't be called
      return;
    }
  
    // 🆕 Auto-detect chat mode when no pillar selected (only in stories mode)
    if (prompt.trim() && (!selectedPillar || selectedKeywords.length === 0)) {
      localStorage.setItem("pendingChatPrompt", prompt);
      setContentMode("chat"); // Switch to chat mode
      setToast({
        open: true,
        message: "Switching to AI Chat since no pillar/keyword was selected.",
        severity: "info",
      });
      return;
    }
    
    // Story generation logic (unchanged)
    if (!prompt.trim() || !selectedPillar || selectedKeywords.length === 0) {
      setToast({
        open: true,
        message: "Please enter a prompt, select a pillar, and choose at least one keyword.",
        severity: "warning",
      });
      return;
    }
  
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setToast({
        open: true,
        message: t("messages.missingUser"),
        severity: "error",
      });
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(10);

    const requestData = {
      pillar: selectedPillar,
      keywords: selectedKeywords,
      prompt,
      theme: selectedPillar,
      userId,
      language,
      tone: toneMapReverse[tone] || "neutral",
      length,
      fast: true,
    };

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const generateResponse = await fetch(
        `${API_URL}/generate-story/instant`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(requestData),
        }
      );

      const generateData = await generateResponse.json();
      if (!generateResponse.ok)
        throw new Error(generateData.message || "Failed to generate story ideas");

      if (generateData.angles?.length > 0) {
        setGeneratedStoryId(generateData.storyId);
        setGeneratedAngles(generateData.angles);
        setShowAngleSelection(true);
        setLoading(false);
        setProgress(100);
      
        localStorage.setItem(
          "pendingStoryDraft",
          JSON.stringify({
            storyId: generateData.storyId,
            angles: generateData.angles,
            timestamp: Date.now(),
          })
        );
      
        setToast({
          open: true,
          message: "✅ Story angles generated! Choose one to view full story.",
          severity: "success",
        });
        return;
      }
      
      throw new Error("No story angles returned from server.");
    } catch (err) {
      console.error("❌ Error generating story:", err);
      setError(err.message);
      setToast({
        open: true,
        message: `${t("messages.errorGenerate")}: ${err.message}`,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🆕 UPDATED: Handle upload button click
  const handleUploadClick = () => {
    setContentMode("upload");
  };

  // 🆕 UPDATED: Handle back to stories
  const handleBackToStories = () => {
    setContentMode("stories");
    // Clear any pending chat prompt
    localStorage.removeItem("pendingChatPrompt");
  };

  // Handle Delete Confirmation Modal
  const openDeleteModal = (storyId) => {
    setStoryToDelete(storyId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setStoryToDelete(null);
  };

  const handleDeleteStory = async () => {
    if (!storyToDelete) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      await fetch(`${API_URL}/stories/${storyToDelete}`, {
        method: "DELETE",
      });
      setStories((prev) => prev.filter((story) => story._id !== storyToDelete));
      setToast({
        open: true,
        message: t("messages.deleteSuccess"),
        severity: "success",
      });
    } catch (error) {
      setToast({
        open: true,
        message: t("messages.deleteError"),
        severity: "error",
      });
    } finally {
      closeDeleteModal();
    }
  };

  const handleExportStory = (story) => {
    exportStoryPDF(story);
  };

  return (
    <div
      ref={topRef}
      className={`p-5 font-sans min-h-screen transition-colors duration-300 ${
        isNightMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      }`}
    >
      {/* Loading Overlay */}
      <LoadingOverlay loading={loading} progress={progress} />

      {/* Voice Input Modal */}
      <VoiceModal
        isNightMode={isNightMode}
        isVoiceModalOpen={isVoiceModalOpen}
        closeVoiceModal={closeVoiceModal}
        modalTranscript={modalTranscript}
        listening={listening}
        startListening={startListening}
        stopListening={stopListening}
        applyVoiceInput={applyVoiceInput}
      />

      {/* Breadcrumb Header */}
      <div className="text-sm mb-4">
        <span className="font-semibold">{t("breadcrumb.overview")}</span> &gt;{" "}
        <span className="font-semibold">{t("breadcrumb.generate")}</span>
      </div>

      {/* Updated Heading */}
      <h1 className="text-2xl font-bold mb-5">{t("heading")}</h1>

      {/* 🆕 UPDATED: Fixed Input Prompt - Always Visible */}
      <div className="mb-6">
        <PromptInput
          isNightMode={isNightMode}
          prompt={prompt}
          setPrompt={setPrompt}
          openVoiceModal={openVoiceModal}
          startListening={startListening}
          handleGenerate={handleGenerate}
          loading={loading}
          selectedPillar={selectedPillar}
          setSelectedPillar={setSelectedPillar}
          pillarData={pillarData}
          language={language}
          setLanguage={setLanguage}
          tone={tone}
          setTone={setTone}
          selectedKeywords={selectedKeywords}
          setSelectedKeywords={setSelectedKeywords}
          // 🆕 UPDATED: Mode control props
          onUploadClick={handleUploadClick}
          onModeChange={setContentMode}
          currentMode={contentMode} // 🆕 NEW: Pass current mode
          onSendMessage={handleSendMessage} // 🆕 NEW: For chat mode
        />

        {/* Angle Selection (shows when generating stories) */}
        {showAngleSelection && generatedAngles.length > 0 && (
          <AngleSelection
            isNightMode={isNightMode}
            generatedAngles={generatedAngles}
            handleSelectAngle={handleSelectAngle}
            className={`${selectedKeywords.length > 0 ? "mt-24" : "mt-12"}`}
          />
        )}
      </div>

      {/* 🆕 UPDATED: Dynamic Content Area - No More Tabs */}
      <div className="transition-all duration-300">
        {contentMode === "stories" && (
          <div className="animate-fadeIn">
            <StoryList
              stories={combinedItems} // 🆕 UPDATED: Use combinedItems instead of stories
              currentPage={currentPage}
              storiesPerPage={storiesPerPage}
              setCurrentPage={setCurrentPage}
              isNightMode={isNightMode}
              handleExportStory={handleExportStory}
              handleContinueDiscussion={handleContinueDiscussion}
              handleChatClick={handleChatClick} // 🆕 NEW: Add chat click handler
              navigate={navigate}
              openDeleteModal={openDeleteModal}
              loadingRecs={loadingRecs}
              recommendationsMap={recommendationsMap}
              formatStoryContent={formatStoryContent}
            />
          </div>
        )}

        {contentMode === "upload" && (
          <div className="animate-fadeIn">
            {/* 🆕 NEW: Back button for upload */}
            <div className="flex items-center mb-4">
              <button 
                onClick={handleBackToStories}
                className={`flex items-center gap-2 ${
                  isNightMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-800"
                } transition-colors`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Stories
              </button>
            </div>
            <UploadTab />
          </div>
        )}

        {contentMode === "chat" && (
          <div className="animate-fadeIn">
            {/* 🆕 NEW: Back button for chat */}
            <div className="flex items-center mb-4">
              <button 
                onClick={handleBackToStories}
                className={`flex items-center gap-2 ${
                  isNightMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-800"
                } transition-colors`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Stories
              </button>
            </div>
            <AIChatTab 
              // 🆕 UPDATED: Pass shared prompt state
              input={prompt}
              setInput={setPrompt}
              onSendMessage={handleSendMessage}
              onBackToStories={handleBackToStories}
            />
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isNightMode={isNightMode}
        isDeleteModalOpen={isDeleteModalOpen}
        closeDeleteModal={closeDeleteModal}
        handleDeleteStory={handleDeleteStory}
      />

      {/* Snackbar for Feedback */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <MuiAlert
          severity={toast.severity}
          elevation={6}
          variant="filled"
          onClose={() => setToast({ ...toast, open: false })}
        >
          {toast.message}
        </MuiAlert>
      </Snackbar>

      {/* Guided Tour for PromptInput */}
      <PromptInputTour isNightMode={isNightMode} />
    </div>
  );
};

export default GenerateStory;