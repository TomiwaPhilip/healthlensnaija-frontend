import React from "react";
import { motion } from "framer-motion";
import { FiZap, FiChevronRight } from "react-icons/fi";

const AngleSelection = ({ isNightMode, generatedAngles, handleSelectAngle, className = "" }) => {
  if (!generatedAngles || generatedAngles.length === 0) return null;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    hover: {
      y: -4,
      scale: 1.02,
      boxShadow: isNightMode
        ? "0 12px 24px -8px rgba(0, 0, 0, 0.3)"
        : "0 12px 24px -8px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.2, ease: "easeOut" }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.05, y: -1 },
    tap: { scale: 0.95 }
  };

  return (
    <div className={`space-y-6 ${className}`}> {/* Increased from mt-8 to mt-16 */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-lg ${
          isNightMode ? "bg-green-900/40" : "bg-green-100"
        }`}>
          <FiZap className="h-5 w-5 text-green-600 dark:text-green-400" />
        </div>
        <h2 className={`text-2xl font-bold ${
          isNightMode ? "text-white" : "text-gray-900"
        }`}>
          Select your story angle
        </h2>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {generatedAngles.map((angle) => (
          <motion.div
            key={angle.index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className={`p-6 rounded-2xl border transition-all duration-300 ${
              isNightMode
                ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-green-500/30"
                : "bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-green-400/50"
            }`}
          >
            {/* Angle Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className={`font-bold text-lg leading-tight mb-2 ${
                  isNightMode ? "text-white" : "text-gray-900"
                }`}>
                  {angle.title}
                </h3>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  isNightMode
                    ? "bg-green-900/40 text-green-300 border border-green-700/50"
                    : "bg-green-100 text-green-800 border border-green-200"
                }`}>
                  Angle {angle.index + 1}
                </div>
              </div>
            </div>

            {/* Synopsis */}
            <p className={`text-sm leading-relaxed mb-4 ${
              isNightMode ? "text-gray-300" : "text-gray-600"
            }`}>
              {angle.synopsis}
            </p>

            {/* Key Points */}
            {angle.keyPoints?.length > 0 && (
              <div className="mb-5">
                <h4 className={`text-xs font-semibold uppercase tracking-wide mb-3 ${
                  isNightMode ? "text-gray-400" : "text-gray-500"
                }`}>
                  Key Points
                </h4>
                <ul className="space-y-2">
                  {angle.keyPoints.map((pt, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`flex items-start text-sm ${
                        isNightMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      <span className={`flex-shrink-0 w-1.5 h-1.5 rounded-full mt-1.5 mr-3 ${
                        isNightMode ? "bg-green-400" : "bg-green-500"
                      }`} />
                      <span className="leading-relaxed">{pt}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            {/* Choose Button */}
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => handleSelectAngle(angle.index)}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                isNightMode
                  ? "bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-500/25"
                  : "bg-green-500 hover:bg-green-400 text-white shadow-lg shadow-green-500/40"
              }`}
            >
              Choose this angle
              <FiChevronRight className="h-4 w-4" />
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Selection Help Text */}
      <div className={`text-center mt-6 p-4 rounded-lg ${
        isNightMode ? "bg-gray-800/50" : "bg-gray-50"
      }`}>
        <p className={`text-sm ${
          isNightMode ? "text-gray-400" : "text-gray-600"
        }`}>
          Each angle offers a different perspective on your topic. Choose the one that best fits your narrative goals.
        </p>
      </div>
    </div>
  );
};

export default AngleSelection;