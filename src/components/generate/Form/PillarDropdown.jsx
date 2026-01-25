import React, { useRef, useEffect } from "react";

const PillarDropdown = ({
  isNightMode,
  selectedPillar,
  isPillarDropdownOpen,
  setIsPillarDropdownOpen,
  setIsKeywordDropdownOpen,
  handlePillarChange,
  pillarData
}) => {
  const pillarDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pillarDropdownRef.current && !pillarDropdownRef.current.contains(event.target)) {
        setIsPillarDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsPillarDropdownOpen]);

  const togglePillarDropdown = () => {
    setIsPillarDropdownOpen((prev) => !prev);
    setIsKeywordDropdownOpen(false);
  };

  return (
    <div className="relative" ref={pillarDropdownRef}>
      <label className="block font-bold mb-2">Select Pillar:</label>
      <button
        onClick={togglePillarDropdown}
        className={`w-full p-3 border rounded-lg text-left flex justify-between items-center transition-colors ${
          isNightMode
            ? "bg-gray-700 border-gray-600 hover:bg-gray-600"
            : "bg-white border-gray-300 hover:bg-gray-50"
        }`}
      >
        {selectedPillar || "Select a Pillar"}
        <svg
          className={`w-5 h-5 transition-transform ${
            isPillarDropdownOpen ? "transform rotate-180" : ""
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
      {isPillarDropdownOpen && (
        <div
          className={`absolute z-10 w-full mt-2 border rounded-lg shadow-lg max-h-60 overflow-y-auto transition-all ${
            isNightMode ? "bg-gray-700 border-gray-600" : "bg-white"
          }`}
        >
          {Object.keys(pillarData).map((pillar) => (
            <div
              key={pillar}
              onClick={() => handlePillarChange(pillar)}
              className={`p-3 cursor-pointer transition-colors ${
                isNightMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
              }`}
            >
              {pillar}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PillarDropdown;