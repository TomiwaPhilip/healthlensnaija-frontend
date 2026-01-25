import React, { useState, useRef, useEffect } from "react";

const KeywordDropdown = ({
  isNightMode,
  selectedPillar,
  selectedKeywords,
  isKeywordDropdownOpen,
  setIsKeywordDropdownOpen,
  setIsPillarDropdownOpen,
  handleKeywordChange,
  pillarData
}) => {
  const [keywordSearch, setKeywordSearch] = useState("");
  const keywordDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (keywordDropdownRef.current && !keywordDropdownRef.current.contains(event.target)) {
        setIsKeywordDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsKeywordDropdownOpen]);

  const toggleKeywordDropdown = () => {
    setIsKeywordDropdownOpen((prev) => !prev);
    setIsPillarDropdownOpen(false);
  };

  if (!selectedPillar) return null;

  return (
    <div className="relative" ref={keywordDropdownRef}>
      <label className="block font-bold mb-2">Select Keywords:</label>
      <button
        onClick={toggleKeywordDropdown}
        className={`w-full p-3 border rounded-lg text-left flex justify-between items-center transition-colors ${
          isNightMode
            ? "bg-gray-700 border-gray-600 hover:bg-gray-600"
            : "bg-white border-gray-300 hover:bg-gray-50"
        }`}
      >
        {selectedKeywords.length > 0
          ? selectedKeywords.join(", ")
          : "Select Keywords"}
        <svg
          className={`w-5 h-5 transition-transform ${
            isKeywordDropdownOpen ? "transform rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isKeywordDropdownOpen && (
        <div
          className={`absolute z-10 w-full mt-2 border rounded-lg shadow-lg max-h-60 overflow-y-auto ${
            isNightMode ? "bg-gray-700 border-gray-600" : "bg-white"
          }`}
        >
          <input
            type="text"
            placeholder="Search keywords..."
            value={keywordSearch}
            onChange={(e) => setKeywordSearch(e.target.value)}
            className={`w-full p-3 border-b ${
              isNightMode
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                : "bg-white"
            }`}
          />
          {pillarData[selectedPillar]?.keywords
            .filter((keyword) =>
              keyword.toLowerCase().includes(keywordSearch.toLowerCase())
            )
            .map((keyword) => (
              <div
                key={keyword}
                onClick={() => handleKeywordChange(keyword)}
                className={`p-3 cursor-pointer transition-colors ${
                  selectedKeywords.includes(keyword)
                    ? isNightMode
                      ? "bg-gray-600"
                      : "bg-gray-200"
                    : isNightMode
                    ? "hover:bg-gray-600"
                    : "hover:bg-gray-100"
                }`}
              >
                {keyword}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default KeywordDropdown;