import React, { useState } from 'react';
import { FaFileDownload, FaSearch, FaExternalLinkAlt } from 'react-icons/fa';
import { useTranslation } from "react-i18next";

const Resources = () => {
  const { t } = useTranslation("resources");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [hoveredCard, setHoveredCard] = useState(null);

  // Get resources and tag labels from translations
  const sampleResources = t("resources", { returnObjects: true });
  const tagLabels = t("tags", { returnObjects: true });

  const filteredResources = sampleResources.filter(
    (r) =>
      (!search || 
        r.title.toLowerCase().includes(search.toLowerCase()) || 
        r.description.toLowerCase().includes(search.toLowerCase())
      ) &&
      (filter === "all" || r.type === filter)
  );

  const getFileIcon = (fileType) => {
    switch(fileType) {
      case 'pdf':
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">PDF</span>;
      case 'xlsx':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">Excel</span>;
      default:
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">Web</span>;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-2 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">{t("title")}</h1>
        <span className="text-sm text-gray-500">
          {t("labels.available", { count: filteredResources.length })}
        </span>
      </div>
      <p className="text-gray-600 mb-8">{t("subtitle")}</p>

      {/* Filters */}
      <div className="mb-8">
        <div className="relative mb-4">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {Object.entries(tagLabels).map(([key, label]) => (
            <button
              key={key}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === key
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Cards */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res, i) => (
            <div 
              key={i}
              className={`bg-white p-5 rounded-xl shadow-sm border border-gray-200 transition-all duration-200 ${
                hoveredCard === i ? 'transform hover:-translate-y-1 hover:shadow-md' : ''
              }`}
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex justify-between items-start mb-3">
                {getFileIcon(res.fileType)}
                <span className="text-xs text-gray-500">{res.updated}</span>
              </div>
              
              <h2 className="text-xl font-semibold mb-2 text-gray-800">{res.title}</h2>
              <p className="text-gray-600 mb-4">{res.description}</p>
              
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                  {tagLabels[res.type]}
                </span>
                
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center gap-1 transition-colors"
                >
                  {res.fileType === 'web' ? (
                    <>
                      {t("actions.viewDocs")} <FaExternalLinkAlt className="text-xs" />
                    </>
                  ) : (
                    <>
                      {t("actions.download")} <FaFileDownload />
                    </>
                  )}
                </a>
              </div>
              
              {res.fileSize && (
                <div className="mt-3 text-xs text-gray-500">
                  {t("labels.fileSize", { size: res.fileSize })}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
          <p className="text-gray-500 mb-4">{t("labels.noResults")}</p>
          <button 
            onClick={() => {
              setSearch('');
              setFilter('all');
            }}
            className="text-green-600 hover:text-green-800 font-medium"
          >
            {t("actions.clearFilters")}
          </button>
        </div>
      )}

      {/* QuickInsights Panel */}
      <div className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-600 p-5 rounded-lg">
        <div className="flex items-start">
          <span className="text-2xl mr-3">🧠</span>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {t("quickInsight.title")}
            </h2>
            <blockquote className="text-gray-700 italic">
              {t("quickInsight.quote")}
            </blockquote>
            <a 
              href="/quickinsights" 
              className="inline-block mt-3 text-green-600 hover:text-green-800 font-medium text-sm flex items-center"
            >
              {t("quickInsight.explore")} <FaExternalLinkAlt className="ml-1 text-xs" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
