import React from "react";
import { useTranslation } from "react-i18next";

const DeleteModal = ({
  isNightMode,
  isDeleteModalOpen,
  closeDeleteModal,
  handleDeleteStory
}) => {
  if (!isDeleteModalOpen) return null;

  const { t } = useTranslation("story");

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className={`p-6 rounded-lg shadow-lg w-full max-w-md ${
          isNightMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h3
          className={`text-lg font-semibold mb-4 ${
            isNightMode ? "text-white" : "text-gray-800"
          }`}
        >
          {t("modal.deleteConfirm")}
        </h3>
        <div className="flex justify-end space-x-4">
          <button
            onClick={closeDeleteModal}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isNightMode
                ? "bg-gray-600 hover:bg-gray-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {t("modal.cancel")}
          </button>
          <button
            onClick={handleDeleteStory}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            {t("modal.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
