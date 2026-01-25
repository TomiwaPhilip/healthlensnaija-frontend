import React from "react";

const GenerateButton = ({ loading, handleGenerate }) => {
  return (
    <div className="text-right">
      <button
        onClick={handleGenerate}
        disabled={loading}
        className={`px-6 py-3 rounded-lg transition-all duration-300 ${
          loading
            ? "bg-green-400 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600 transform hover:scale-105"
        } text-white font-semibold shadow-md`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Generating...
          </span>
        ) : (
          "Generate Angle"
        )}
      </button>
    </div>
  );
};

export default GenerateButton;