import React, { useState, useEffect } from "react";
import axios from "../../utils/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";

export default function ScrapeTools({ scrapedSites, setScrapedSites }) {
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [editingSite, setEditingSite] = useState(null);
  const [promotingSite, setPromotingSite] = useState(null);
  const [selectedPillar, setSelectedPillar] = useState("");

  const [scrapeSearch, setScrapeSearch] = useState("");
  const [scrapeSortField, setScrapeSortField] = useState("createdAt");
  const [scrapeSortOrder, setScrapeSortOrder] = useState("desc");
  const [isLoading, setIsLoading] = useState(false);

  // 🔹 Base URL management
  const [baseUrls, setBaseUrls] = useState([]);
  const [newBaseUrl, setNewBaseUrl] = useState("");
  const [editingBaseUrl, setEditingBaseUrl] = useState(null);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };

  const slideUp = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } }
  };

  // --- Fetch Base URLs ---
  const fetchBaseUrls = async () => {
    try {
      const res = await axios.get("/admin-dashboard/scrape/base-urls");
      setBaseUrls(res.data);
    } catch (err) {
      console.error("❌ Failed fetching base URLs", err);
    }
  };

  // --- Delete Base URL ---
  const deleteBaseUrl = async (id) => {
    if (!window.confirm("Delete this base URL?")) return;
    setIsLoading(true);
    try {
      await axios.delete(`/admin-dashboard/scrape/base-urls/${id}`);
      fetchBaseUrls();
    } catch (err) {
      alert("Delete failed: " + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  // Run on mount
  useEffect(() => {
    fetchBaseUrls();
  }, []);

  // --- Filter + Sort ---
  const filteredScrapes = scrapedSites
    .filter((s) =>
      `${s.title} ${s.url} ${s.preview}`
        .toLowerCase()
        .includes(scrapeSearch.toLowerCase())
    )
    .sort((a, b) => {
      const valA = a[scrapeSortField] || "";
      const valB = b[scrapeSortField] || "";
      return scrapeSortOrder === "asc"
        ? valA > valB ? 1 : -1
        : valA < valB ? 1 : -1;
    });

  const fetchScrapedSites = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("/admin-dashboard/scrape/list");
      setScrapedSites(res.data);
    } catch (err) {
      alert("Failed to fetch scraped sites: " + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSite = async (id) => {
    if (!window.confirm("Delete this scraped site?")) return;
    setIsLoading(true);
    try {
      await axios.delete(`/admin-dashboard/scrape/${id}`);
      fetchScrapedSites();
    } catch (err) {
      alert("Delete failed: " + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.section 
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="p-4 md:p-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Scraping Tools</h2>
      </div>

      {/* Scraping Actions */}
      <motion.div 
        variants={slideUp}
        className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-md space-y-4 mb-6"
      >
        {/* Nigeria Health Watch scrape */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={async () => {
            if (!window.confirm("Scrape all Nigeria Health Watch base URLs?")) return;
            setIsLoading(true);
            try {
              const res = await axios.post("/admin-dashboard/scrape/nigeria-health-watch");
              alert(`${res.data.message}\nPreview: ${res.data.preview}`);
              fetchScrapedSites();
            } catch (err) {
              alert("Scraping failed: " + (err.response?.data?.message || err.message));
            } finally {
              setIsLoading(false);
            }
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2 w-full md:w-auto justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
          </svg>
          Scrape Nigeria Health Watch
        </motion.button>

        {/* Scrape custom URL */}
        <div className="flex flex-col md:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Enter URL to scrape..."
              value={scrapeUrl}
              onChange={(e) => setScrapeUrl(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={async () => {
              if (!scrapeUrl) return alert("Enter a URL first.");
              setIsLoading(true);
              try {
                const res = await axios.post("/admin-dashboard/scrape/url", { url: scrapeUrl });
                alert(`${res.data.message}\nPreview: ${res.data.preview}`);
                fetchScrapedSites();
                setScrapeUrl("");
              } catch (err) {
                alert("Scraping failed: " + (err.response?.data?.message || err.message));
              } finally {
                setIsLoading(false);
              }
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 w-full md:w-auto"
          >
            Scrape URL
          </motion.button>
        </div>
      </motion.div>

      {/* Search & Sort */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <motion.div 
          variants={slideUp}
          className="relative flex-1 w-full"
        >
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search scraped sites..."
            value={scrapeSearch}
            onChange={(e) => setScrapeSearch(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
          />
        </motion.div>
        
        <div className="flex gap-2">
          <motion.select
            variants={slideUp}
            value={scrapeSortField}
            onChange={(e) => setScrapeSortField(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
          >
            <option value="createdAt">Created At</option>
            <option value="title">Title</option>
          </motion.select>
          
          <motion.button
            variants={slideUp}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setScrapeSortOrder(scrapeSortOrder === "asc" ? "desc" : "asc")}
            className="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg shadow-sm transition-colors duration-200 flex items-center gap-2 text-sm md:text-base"
          >
            {scrapeSortOrder === "asc" ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Asc
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Desc
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Scraped Websites */}
      <motion.div 
        variants={fadeIn}
        className="bg-white rounded-lg md:rounded-xl shadow-md overflow-hidden mb-6"
      >
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Scraped Websites</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">URL</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Preview</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredScrapes.length > 0 ? (
                filteredScrapes.map((site) => (
                  <tr key={site._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-4 py-4 whitespace-normal text-sm font-medium text-gray-900 max-w-xs">
                      {site.title}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600 underline max-w-xs truncate hidden md:table-cell">
                      <a href={site.url} target="_blank" rel="noopener noreferrer" className="truncate">{site.url}</a>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 max-w-md truncate hidden lg:table-cell">
                      {site.preview?.slice(0, 100)}...
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => deleteSite(site._id)}
                          className="text-red-600 hover:text-red-900 p-1 md:p-2"
                          title="Delete"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setEditingSite(site)}
                          className="text-yellow-600 hover:text-yellow-900 p-1 md:p-2"
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setPromotingSite(site)}
                          className="text-green-600 hover:text-green-900 p-1 md:p-2"
                          title="Promote"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                          </svg>
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="h-32">
                  <td colSpan="4" className="text-center text-gray-500 py-10">
                    No scraped sites found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Base URLs Section */}
      <motion.div 
        variants={fadeIn}
        className="bg-white rounded-lg md:rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Nigeria Health Watch Base URLs</h3>
        </div>
        <div className="p-4">
          <div className="flex flex-col md:flex-row mb-4 gap-2">
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Add new base URL..."
                value={newBaseUrl}
                onChange={(e) => setNewBaseUrl(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={async () => {
                if (!newBaseUrl) return alert("Enter a URL first.");
                setIsLoading(true);
                try {
                  await axios.post("/admin-dashboard/scrape/base-urls", { url: newBaseUrl });
                  setNewBaseUrl("");
                  fetchBaseUrls();
                } catch (err) {
                  alert("Failed to add URL: " + (err.response?.data?.message || err.message));
                } finally {
                  setIsLoading(false);
                }
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 w-full md:w-auto"
            >
              Add
            </motion.button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {baseUrls.length > 0 ? (
                  baseUrls.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-4 py-4 whitespace-normal text-sm text-gray-900 break-all">{u.url}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => deleteBaseUrl(u._id)}
                            className="text-red-600 hover:text-red-900 p-1 md:p-2"
                            title="Delete"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setEditingBaseUrl(u)}
                            className="text-yellow-600 hover:text-yellow-900 p-1 md:p-2"
                            title="Edit"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </motion.button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="h-32">
                    <td colSpan="2" className="text-center text-gray-500 py-10">
                      No base URLs found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Modal: Promote */}
      <AnimatePresence>
        {promotingSite && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-lg md:rounded-xl shadow-2xl w-full max-w-md mx-4"
            >
              <div className="p-4 md:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg md:text-xl font-bold text-gray-800">Promote to AI Training</h3>
                  <button 
                    onClick={() => {
                      setPromotingSite(null);
                      setSelectedPillar("");
                    }}
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <p className="mb-3 text-gray-600 text-sm md:text-base">Choose a pillar for <strong>{promotingSite.title}</strong></p>

                <select
                  value={selectedPillar}
                  onChange={(e) => setSelectedPillar(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                >
                  <option value="">-- Select Pillar --</option>
                  <option value="Effective Governance">Effective Governance</option>
                  <option value="Efficient">Efficient</option>
                  <option value="Equitable and Quality Health Systems">Equitable and Quality Health Systems</option>
                  <option value="Unlocking Value Chains">Unlocking Value Chains</option>
                  <option value="Health Security">Health Security</option>
                </select>

                <div className="flex justify-end space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setPromotingSite(null);
                      setSelectedPillar("");
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 text-sm md:text-base"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    disabled={!selectedPillar}
                    onClick={async () => {
                      setIsLoading(true);
                      try {
                        await axios.post(`/admin-dashboard/scrape/${promotingSite._id}/promote`, {
                          pillar: selectedPillar,
                        });
                        alert("Promoted successfully");
                        setPromotingSite(null);
                        setSelectedPillar("");
                      } catch (err) {
                        alert("Promotion failed: " + (err.response?.data?.message || err.message));
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    className={`px-4 py-2 rounded-lg text-white ${!selectedPillar ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} transition-colors duration-200 text-sm md:text-base`}
                  >
                    Save
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal: Edit site */}
      <AnimatePresence>
        {editingSite && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-lg md:rounded-xl shadow-2xl w-full max-w-2xl mx-4"
            >
              <div className="p-4 md:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg md:text-xl font-bold text-gray-800">Edit Scraped Website</h3>
                  <button 
                    onClick={() => setEditingSite(null)}
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      placeholder="Title"
                      value={editingSite.title}
                      onChange={(e) => setEditingSite({ ...editingSite, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <textarea
                      placeholder="Content"
                      value={editingSite.content}
                      onChange={(e) => setEditingSite({ ...editingSite, content: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg h-32 md:h-40 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setEditingSite(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 text-sm md:text-base"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={async () => {
                      setIsLoading(true);
                      try {
                        await axios.put(`/admin-dashboard/scrape/${editingSite._id}`, editingSite);
                        fetchScrapedSites();
                        setEditingSite(null);
                        alert("Updated successfully");
                      } catch (err) {
                        alert("Update failed: " + (err.response?.data?.message || err.message));
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    className="px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors duration-200 text-sm md:text-base"
                  >
                    Save
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}