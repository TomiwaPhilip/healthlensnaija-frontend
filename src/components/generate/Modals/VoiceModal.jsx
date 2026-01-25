import React from "react";
import { useTranslation } from "react-i18next";

const VoiceModal = ({
  isNightMode,
  isVoiceModalOpen,
  closeVoiceModal,
  modalTranscript,
  listening,
  startListening,
  stopListening,
  applyVoiceInput
}) => {
  if (!isVoiceModalOpen) return null;

  const { t } = useTranslation("story");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div
        className={`w-full max-w-2xl rounded-lg shadow-xl p-6 ${
          isNightMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{t("voiceModal.title")}</h2>
          <button
            onClick={closeVoiceModal}
            className={`p-2 rounded-full ${
              isNightMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <div
            className={`p-4 rounded-lg min-h-40 max-h-96 overflow-y-auto ${
              isNightMode ? "bg-gray-700" : "bg-gray-100"
            }`}
          >
            {modalTranscript ? (
              <p className="text-lg">{modalTranscript}</p>
            ) : (
              <p className="text-gray-500 italic">
                {listening ? t("voiceModal.listening") : t("voiceModal.startPrompt")}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
          {listening ? (
            <button
              onClick={stopListening}
              className="flex items-center justify-center px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                />
              </svg>
              {t("voiceModal.stopBtn")}
            </button>
          ) : (
            <button
              onClick={startListening}
              className="flex items-center justify-center px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
              {t("voiceModal.startBtn")}
            </button>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={closeVoiceModal}
            className={`px-6 py-2 rounded-lg ${
              isNightMode
                ? "bg-gray-600 hover:bg-gray-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            } transition-colors`}
          >
            {t("voiceModal.cancel")}
          </button>
          <button
            onClick={applyVoiceInput}
            disabled={!modalTranscript}
            className={`px-6 py-2 rounded-lg ${
              modalTranscript
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-green-300 text-white cursor-not-allowed"
            } transition-colors`}
          >
            {t("voiceModal.apply")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceModal;
