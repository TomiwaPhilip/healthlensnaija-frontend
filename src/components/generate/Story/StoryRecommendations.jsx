// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { FiBookOpen, FiChevronRight, FiClock, FiZap, FiLoader } from "react-icons/fi";
// import axios from "axios"; // 🟩 for interaction tracking

// const StoryRecommendations = ({ 
//   loading, 
//   recommendations, 
//   navigate, 
//   isNightMode,
//   expanded = true 
// }) => {
//   const [showAll, setShowAll] = useState(false);

//   // 🟩 helper: track interactions
//   const trackInteraction = async (storyId, type) => {
//     try {
//       await axios.post(
//         `${import.meta.env.VITE_API_URL}/stories/${storyId}/interaction`,
//         { type },
//         { withCredentials: true }
//       );
//     } catch (err) {
//       console.warn("Interaction track failed:", err.message);
//     }
//   };

//   const containerVariants = {
//     hidden: { opacity: 0, height: 0 },
//     visible: {
//       opacity: 1,
//       height: "auto",
//       transition: { duration: 0.3, staggerChildren: 0.1 }
//     }
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 10 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.2 }
//     }
//   };

//   const loadingVariants = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1, transition: { duration: 0.3 } }
//   };

//   if (!expanded) return null;
//   const displayedRecommendations = showAll ? recommendations : recommendations.slice(0, 2);

//   return (
//     <motion.div
//       variants={containerVariants}
//       initial="hidden"
//       animate="visible"
//       className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700"
//     >
//       <div className="flex items-center justify-between mb-4">
//         <h4 className="text-lg font-semibold flex items-center gap-2 text-gray-800 dark:text-white">
//           <FiZap className="h-5 w-5 text-yellow-500" />
//           Recommended Stories
//           <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
//             ({recommendations.length})
//           </span>
//         </h4>

//         {recommendations.length > 2 && (
//           <button
//             onClick={() => setShowAll(!showAll)}
//             className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors flex items-center gap-1"
//           >
//             {showAll ? "Show less" : "Show all"}
//             <FiChevronRight className={`h-4 w-4 transition-transform ${showAll ? "rotate-90" : ""}`} />
//           </button>
//         )}
//       </div>

//       <AnimatePresence mode="sync">
//         {loading ? (
//           <motion.div key="loading" variants={loadingVariants} className="flex items-center justify-center py-8">
//             <div className="text-center">
//               <motion.div
//                 animate={{ rotate: 360 }}
//                 transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                 className="mx-auto mb-3"
//               >
//                 <FiLoader className="h-8 w-8 text-gray-400" />
//               </motion.div>
//               <p className={isNightMode ? "text-gray-400" : "text-gray-600"}>
//                 Finding similar stories...
//               </p>
//             </div>
//           </motion.div>
//         ) : recommendations.length === 0 ? (
//           <motion.div key="empty" variants={loadingVariants} className="text-center py-6 text-gray-500 dark:text-gray-400">
//             <FiBookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
//             <p>No recommendations available</p>
//           </motion.div>
//         ) : (
//           <motion.div key="recommendations" variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-3">
//             <AnimatePresence>
//               {displayedRecommendations.map((rec, idx) => {
//                 const storyId = rec.story?._id || rec._id;
//                 return (
//                   <motion.div
//                     key={storyId || `rec-${idx}`}
//                     variants={itemVariants}
//                     layout
//                     className={`group p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
//                       isNightMode
//                         ? "bg-gray-800 border-gray-700 hover:border-gray-600 hover:shadow-lg hover:shadow-gray-900/30"
//                         : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg hover:shadow-blue-100/50"
//                     }`}
//                     onClick={() => {
//                       trackInteraction(storyId, "click"); // 🟩 track click
//                       navigate(`?storyId=${storyId}`);
//                     }}
//                     whileHover={{ y: -2 }}
//                     whileTap={{ scale: 0.98 }}
//                   >
//                     <div className="flex items-start justify-between mb-2">
//                       <h5
//                         className={`font-semibold line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${
//                           isNightMode ? "text-blue-400" : "text-blue-600"
//                         }`}
//                       >
//                         {rec.title}
//                       </h5>
//                       <FiChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 flex-shrink-0 mt-1 ml-2" />
//                     </div>

//                     <p
//                       className={`text-sm line-clamp-3 mb-3 ${
//                         isNightMode ? "text-gray-400" : "text-gray-600"
//                       }`}
//                     >
//                       {rec.summary || "No description available"}
//                     </p>

//                     <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
//                       {rec.tags && rec.tags.length > 0 && (
//                         <span className="inline-flex items-center gap-1">
//                           <FiBookOpen className="h-3 w-3" />
//                           {rec.tags[0]}
//                           {rec.tags.length > 1 && ` +${rec.tags.length - 1}`}
//                         </span>
//                       )}
//                       {rec.createdAt && (
//                         <span className="inline-flex items-center gap-1">
//                           <FiClock className="h-3 w-3" />
//                           {new Date(rec.createdAt).toLocaleDateString()}
//                         </span>
//                       )}
//                     </div>
//                   </motion.div>
//                 );
//               })}
//             </AnimatePresence>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {recommendations.length > 2 && !showAll && (
//         <div
//           className={`relative mt-2 h-8 bg-gradient-to-t ${
//             isNightMode ? "from-gray-800 to-transparent" : "from-white to-transparent"
//           }`}
//         >
//           <button
//             onClick={() => setShowAll(true)}
//             className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
//           >
//             +{recommendations.length - 2} more
//           </button>
//         </div>
//       )}
//     </motion.div>
//   );
// };

// export default StoryRecommendations;
