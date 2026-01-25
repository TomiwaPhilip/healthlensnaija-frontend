// components/generate/Modals/LoadingOverlay.jsx
import React, { memo } from "react";
import { useTranslation } from "react-i18next";

const LoadingOverlay = memo(({ loading, progress }) => {
  const { t } = useTranslation("story");

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center pointer-events-none transition-opacity duration-300 ${
        loading ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="w-64 bg-gray-800 rounded-lg p-4 shadow-lg">
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-[width] duration-300 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <p className="text-white mt-4 text-base font-semibold">
          {t("loading.title")}
        </p>
        <p className="text-gray-300 text-sm">
          {progress < 30
            ? t("loading.gathering")
            : progress < 60
            ? t("loading.analyzing")
            : progress < 90
            ? t("loading.writing")
            : t("loading.finalizing")}
        </p>
        <p className="text-gray-400 text-xs mt-2 animate-pulse">
          {t("loading.wait")}
        </p>
      </div>
    </div>
  );
});

export default LoadingOverlay;
