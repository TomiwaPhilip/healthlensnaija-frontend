import React, { useState, useRef, useEffect } from "react";
import {
  FiMic,
  FiSend,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
  FiX,
  FiArrowLeft,
  FiPlus,
  FiMessageCircle, // 🆕 ADDED: Chat icon
} from "react-icons/fi";
import pillarIcon from "./history.png";

const PillarIcon = ({ className = "w-4 h-4" }) => (
  <img
    src={pillarIcon}
    alt="Pillar Icon"
    className={`${className} object-contain`}
    style={{
      filter:
        "brightness(0) saturate(100%) invert(60%) sepia(84%) saturate(424%) hue-rotate(67deg) brightness(103%) contrast(97%)",
    }}
  />
);

const PromptInput = ({
  isNightMode,
  prompt,
  setPrompt,
  openVoiceModal,
  startListening,
  handleGenerate,
  loading,
  selectedPillar,
  setSelectedPillar,
  pillarData,
  language,
  setLanguage,
  tone,
  selectedKeywords,
  setSelectedKeywords,
  setTone,
  // 🆕 UPDATED PROPS: Mode control
  onUploadClick,
  onModeChange,
  currentMode = "stories", // 🆕 NEW: "stories" | "chat" | "upload"
  onSendMessage, // 🆕 NEW: For chat mode
}) => {
  const [isPillarOpen, setIsPillarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showToneSelector, setShowToneSelector] = useState(false);

  const scrollRef = useRef(null);
  const pillarRef = useRef(null);
  const settingsRef = useRef(null);
  const textareaRef = useRef(null);

  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(false);

  // ✅ Detect overflow and show scroll arrows
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const checkOverflow = () => {
      setShowLeftBtn(el.scrollLeft > 0);
      setShowRightBtn(el.scrollWidth > el.clientWidth + 5);
    };
    checkOverflow();
    el.addEventListener("scroll", checkOverflow);
    window.addEventListener("resize", checkOverflow);
    return () => {
      el.removeEventListener("scroll", checkOverflow);
      window.removeEventListener("resize", checkOverflow);
    };
  }, [selectedKeywords]);

  // ✅ Auto-scroll to the right whenever a new keyword is added
  useEffect(() => {
    const el = scrollRef.current;
    if (el && selectedKeywords.length > 0) {
      el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
    }
  }, [selectedKeywords]);

  // ✅ Enable mouse + touch drag scrolling
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let isDown = false;
    let startX, scrollLeft;

    const start = (e) => {
      isDown = true;
      startX = e.pageX || e.touches[0].pageX;
      scrollLeft = el.scrollLeft;
      el.style.cursor = "grabbing";
    };
    const move = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX || e.touches[0].pageX;
      const walk = (x - startX) * 1.2;
      el.scrollLeft = scrollLeft - walk;
    };
    const stop = () => {
      isDown = false;
      el.style.cursor = "grab";
    };

    el.addEventListener("mousedown", start);
    el.addEventListener("touchstart", start);
    el.addEventListener("mousemove", move);
    el.addEventListener("touchmove", move);
    el.addEventListener("mouseleave", stop);
    el.addEventListener("mouseup", stop);
    el.addEventListener("touchend", stop);

    return () => {
      el.removeEventListener("mousedown", start);
      el.removeEventListener("touchstart", start);
      el.removeEventListener("mousemove", move);
      el.removeEventListener("touchmove", move);
      el.removeEventListener("mouseleave", stop);
      el.removeEventListener("mouseup", stop);
      el.removeEventListener("touchend", stop);
    };
  }, []);

  // ✅ Textarea auto-resize
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 120) + "px";
    }
  }, [prompt]);

  // ✅ Add keywords to the RIGHT
  const toggleKeyword = (kw) => {
    setSelectedKeywords((prev) =>
      prev.includes(kw)
        ? prev.filter((k) => k !== kw)
        : [...prev, kw]
    );
  };

  const clearSelections = () => {
    setSelectedPillar("");
    setSelectedKeywords([]);
  };

  const scrollKeywords = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 120, behavior: "smooth" });
  };

  // 🆕 UPDATED: Unified Handle Send with mode awareness
  const handleSend = () => {
    if (!prompt.trim()) {
      openVoiceModal();
      startListening();
      return;
    }

    // 🆕 MODE-SPECIFIC BEHAVIOR
    switch (currentMode) {
      case "chat":
        // In chat mode, directly send the message
        if (onSendMessage) {
          onSendMessage();
        } else {
          console.warn("onSendMessage not provided for chat mode");
        }
        break;

      case "stories":
        // In story mode, auto-detect if this should be a chat
        if (!selectedPillar || selectedKeywords.length === 0) {
          onModeChange("chat"); // Switch to chat mode
          // The actual sending will happen after mode change
        } else {
          handleGenerate(); // Proceed with normal story generation
        }
        break;

      default:
        // For upload mode or others, use story generation as fallback
        handleGenerate();
        break;
    }
  };

  // 🆕 NEW: Get placeholder text based on mode
  const getPlaceholder = () => {
    switch (currentMode) {
      case "chat":
        return "Type a message...";
      case "upload":
        return "Add a note or description...";
      case "stories":
      default:
        return "Write your prompt...";
    }
  };

  // 🆕 NEW: Get send button icon based on mode
  const getSendButtonIcon = () => {
    if (loading) {
      return <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />;
    }
    
    if (!prompt.trim()) {
      return <FiMic className="w-4 h-4" />;
    }

    switch (currentMode) {
      case "chat":
        return <FiMessageCircle className="w-4 h-4" />;
      case "stories":
      case "upload":
      default:
        return <FiSend className="w-4 h-4" />;
    }
  };

  // ✅ Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isPillarOpen && pillarRef.current && !pillarRef.current.contains(e.target)) {
        setIsPillarOpen(false);
      }
      if (isSettingsOpen && settingsRef.current && !settingsRef.current.contains(e.target)) {
        setIsSettingsOpen(false);
        setShowToneSelector(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isPillarOpen, isSettingsOpen]);

  // ✅ Language options
  const languages = ["English", "Yoruba", "Igbo", "Hausa", "French", "Spanish"];
  // ✅ Tone options
  const tones = ["Formal", "Casual", "Friendly", "Professional", "Playful", "Serious"];

  const bg = isNightMode ? "bg-gray-800" : "bg-white";
  const border = isNightMode ? "border-gray-700" : "border-gray-200";
  const textColor = isNightMode ? "text-white" : "text-gray-800";
  const placeholderColor = isNightMode ? "placeholder-gray-400" : "placeholder-gray-500";
  const hoverBg = isNightMode ? "hover:bg-gray-700" : "hover:bg-gray-100";

  // 🆕 NEW: Show pillar section only in story mode
  const showPillarSection = currentMode === "stories";

  return (
    <div className={`relative w-full transition-all duration-300 ${
      (selectedPillar || selectedKeywords.length > 0) && showPillarSection ? "mb-30" : "mb-4"
    }`}>
    
      {/* --- Language & Tone Preview --- */}
      {(language || tone) && (
        <div className={`language-tone-preview w-full flex justify-end mb-3`}>
          <div
            className={`inline-flex rounded-xl border ${border} ${
              isNightMode ? "bg-gray-900" : "bg-gray-50"
            } px-3 py-2 items-center gap-2 shadow-lg transition-all duration-300`}
          >
            {language && (
              <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-700 border border-green-300 dark:bg-green-800/30 dark:text-green-300 transition-colors">
                <FiSettings className="w-3 h-3" />
                {language}
              </span>
            )}
            {tone && (
              <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-700 border border-green-300 dark:bg-green-800/30 dark:text-green-300 transition-colors">
                🎵 {tone}
              </span>
            )}
          </div>
        </div>
      )}

      {/* --- Main Input Container --- */}
      <div className={`w-full rounded-2xl border ${border} ${bg} p-4 transition-all duration-300 shadow-sm`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
          
          {/* --- Left Side: Pillar + Input --- */}
          <div className="flex items-start gap-3 flex-1 w-full min-w-0">
            {/* --- Pillar Dropdown (Only show in story mode) --- */}
            {showPillarSection && (
              <div className="pillar-dropdown relative flex-shrink-0" ref={pillarRef}>
                <button
                  onClick={() => setIsPillarOpen((p) => !p)}
                  className={`p-2.5 rounded-lg border ${border} transition-all flex items-center justify-center ${
                    selectedPillar
                      ? isNightMode ? "bg-gray-700" : "bg-gray-100"
                      : hoverBg
                  } ${isPillarOpen ? 'ring-2 ring-green-500' : ''}`}
                  title="Select Pillar"
                >
                  <PillarIcon className="w-5 h-5" />
                </button>

                {/* FIXED: Dropdown opens BELOW the button */}
                {isPillarOpen && (
                  <div className={`absolute left-0 top-full mt-2 w-64 rounded-lg border ${border} ${
                    isNightMode ? "bg-gray-900" : "bg-white"
                  } shadow-xl max-h-72 overflow-y-auto z-50 transition-all duration-200`}>
                    {!selectedPillar ? (
                      Object.keys(pillarData).map((pillar) => (
                        <button
                          key={pillar}
                          onClick={() => {
                            setSelectedPillar(pillar);
                            setSelectedKeywords([]);
                          }}
                          className={`w-full px-3 py-2 text-sm cursor-pointer flex items-center gap-2 rounded-md text-left ${hoverBg} ${textColor} transition-colors`}
                        >
                          <PillarIcon className="w-4 h-4" />
                          {pillar}
                        </button>
                      ))
                    ) : (
                      <>
                        <div className="flex justify-between items-center px-3 py-2 border-b border-gray-600/30">
                          <span className="font-semibold flex items-center gap-2">
                            <PillarIcon className="w-4 h-4" />
                            {selectedPillar}
                          </span>
                          <button
                            onClick={() => setSelectedPillar("")}
                            className="p-1 hover:bg-gray-600 rounded transition-colors"
                          >
                            <FiArrowLeft />
                          </button>
                        </div>
                        {pillarData[selectedPillar]?.keywords.map((kw) => (
                          <button
                            key={kw}
                            onClick={() => toggleKeyword(kw)}
                            className={`w-full px-3 py-1.5 text-sm cursor-pointer flex items-center justify-between rounded-md transition-all ${
                              selectedKeywords.includes(kw)
                                ? "bg-green-600 text-white"
                                : `${hoverBg} ${textColor}`
                            }`}
                          >
                            {kw}
                            {selectedKeywords.includes(kw) && <FiCheck />}
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* --- Textarea --- */}
            <div className={`relative flex items-center min-w-0 ${showPillarSection ? "flex-1" : "flex-1"}`}>
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (prompt.trim()) {
                      handleSend();
                    }
                  }
                }}
                placeholder={getPlaceholder()}
                className={`flex-1 resize-none bg-transparent outline-none text-sm px-2 py-1 leading-relaxed w-full prompt-textarea ${textColor} ${placeholderColor} transition-all duration-200`}
                style={{
                  maxHeight: "120px",
                  minHeight: "24px",
                }}
                rows="1"
              />
            </div>
          </div>

          {/* --- Right Side: Upload + Settings + Send --- */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* 🆕 Upload Button - Always visible */}
            <button
              onClick={onUploadClick}
              className={`p-2.5 rounded-lg border ${border} ${hoverBg} transition-all flex items-center justify-center`}
              title="Upload PDF"
            >
              <FiPlus className="w-4 h-4" />
            </button>

            {/* --- Settings --- */}
            <div className="relative settings-button" ref={settingsRef}>             
              <button
                onClick={() => {
                  setIsSettingsOpen((p) => !p);
                  setShowToneSelector(false);
                }}
                className={`p-2.5 rounded-lg border ${border} ${hoverBg} transition-all ${
                  isSettingsOpen ? 'ring-2 ring-green-500' : ''
                }`}
              >
                <FiSettings />
              </button>

              {/* Settings dropdown also opens BELOW */}
              {isSettingsOpen && (
                <div className={`absolute right-0 top-full mt-2 w-48 rounded-lg border ${border} ${
                  isNightMode ? "bg-gray-900" : "bg-white"
                } shadow-xl z-50 transition-all duration-200`}>
                  {!showToneSelector ? (
                    <>
                      {languages.map((lang) => (
                        <button
                          key={lang}
                          onClick={() => {
                            setLanguage(lang);
                            setShowToneSelector(true);
                          }}
                          className={`w-full px-3 py-2 text-sm cursor-pointer rounded-md text-left transition-all ${
                            lang === language
                              ? "bg-green-600 text-white"
                              : `${hoverBg} ${textColor}`
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-center px-3 py-2 border-b border-gray-600/30">
                        <span className="font-semibold">Tone</span>
                        <button
                          onClick={() => setShowToneSelector(false)}
                          className="p-1 hover:bg-gray-600 rounded transition-colors"
                        >
                          <FiArrowLeft />
                        </button>
                      </div>
                      {tones.map((t) => (
                        <button
                          key={t}
                          onClick={() => {
                            setTone(t);
                            setIsSettingsOpen(false);
                          }}
                          className={`w-full px-3 py-2 text-sm cursor-pointer rounded-md text-left transition-all ${
                            t === tone
                              ? "bg-green-600 text-white"
                              : `${hoverBg} ${textColor}`
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* --- Send / Mic --- */}
            <button
              disabled={loading}
              onClick={handleSend}
              className={`p-2.5 rounded-lg text-white transition-all flex items-center justify-center send-button ${
                loading
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {getSendButtonIcon()}
            </button>
          </div>
        </div>
      </div>

      {/* --- Keyword Tray (Only show in story mode with selections) --- */}
      {showPillarSection && (selectedPillar || selectedKeywords.length > 0) && (
        <div
          className={`w-full mt-3 rounded-xl border ${border} keyword-tray ${
            isNightMode ? "bg-gray-900" : "bg-gray-50"
          } p-3 flex items-center gap-3 shadow-lg transition-all duration-300`}
        >
          {selectedPillar && (
            <span className="px-3 py-1.5 rounded-full text-xs bg-gray-600/30 text-gray-200 flex items-center gap-1 flex-shrink-0">
              <PillarIcon className="w-3 h-3" /> {selectedPillar}
            </span>
          )}

          <div className="relative flex-1 min-w-0 overflow-hidden">
            {showLeftBtn && (
              <button
                onClick={() => scrollKeywords(-1)}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-700/80 text-white rounded-full p-1.5 z-10 shadow-md hover:bg-gray-600 transition-all"
              >
                <FiChevronLeft size={14} />
              </button>
            )}

            <div
              ref={scrollRef}
              className="flex gap-2 overflow-x-auto hide-scrollbar scroll-smooth whitespace-nowrap min-w-0 py-1"
              style={{ scrollBehavior: "smooth", cursor: "grab" }}
            >
              {selectedKeywords.map((kw) => (
                <span
                  key={kw}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs bg-green-100 text-green-700 border border-green-300 dark:bg-green-800/30 dark:text-green-300 transition-colors"
                >
                  {kw}
                </span>
              ))}
            </div>

            {showRightBtn && (
              <button
                onClick={() => scrollKeywords(1)}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-700/80 text-white rounded-full p-1.5 z-10 shadow-md hover:bg-gray-600 transition-all"
              >
                <FiChevronRight size={14} />
              </button>
            )}
          </div>

          <button
            onClick={clearSelections}
            className="p-1.5 rounded-lg text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-all flex-shrink-0"
            title="Clear all"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PromptInput;