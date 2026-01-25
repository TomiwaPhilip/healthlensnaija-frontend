import React, { useState, useEffect } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import { FaEye } from "react-icons/fa";
import styles from '../../styles/charts.module.css';
import { useTranslation } from "react-i18next";
const API_URL = import.meta.env.VITE_API_URL;

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// Custom plugin for modern doughnut chart
const doughnutLabelPlugin = {
  id: 'doughnutLabel',
  beforeDraw(chart) {
    const { ctx, chartArea: { width, height } } = chart;
    chart.data.datasets.forEach((dataset, i) => {
      chart.getDatasetMeta(i).data.forEach((datapoint, index) => {
        const { x, y } = datapoint.tooltipPosition();
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        
        const xLine = x >= halfWidth ? x + 30 : x - 30;
        const yLine = y >= halfHeight ? y + 30 : y - 30;
        const xText = x >= halfWidth ? xLine + 20 : xLine - 20;
        
        // Draw line
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(xLine, yLine);
        ctx.strokeStyle = dataset.backgroundColor[index];
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw text
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = x >= halfWidth ? 'left' : 'right';
        ctx.fillStyle = '#30B349';
        ctx.fillText(`${chart.data.labels[index]}: ${dataset.data[index]}`, xText, yLine);
      });
    });
  }
};

const Overview = () => {
  const [overviewData, setOverviewData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { t } = useTranslation("analytics");


  // console.log("[Overview] Render start 🔁", {
  //       overviewDataLength: overviewData.length,
  //       loading,
  //       error,
  //       selectedItem,
  //       showChart
  //     });
  // useEffect(() => {
  //   const timeout = setTimeout(fetchOverview, 200);
  //   return () => clearTimeout(timeout);
  // }, []);
  // Color palette using only specified colors
  const colors = {
    primary: '#30B349',
    secondary: '#8CC43D',
    white: '#ffffff'
  };

  // Fetch overview metrics from the backend for the logged-in user
  const fetchOverview = async () => {
    console.log("[Overview] Fetching overview data...");
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not logged in");
      const response = await fetch(`${API_URL}/overview`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch overview data");
      }
      const data = await response.json();
      console.log("[Overview] Fetch success ✅", data);
      setOverviewData(data);
      setLoading(false);
    } catch (err) {
      console.error("[Overview] Fetch error ❌", err.message);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("[Overview] useEffect(fetchOverview) → run");
    fetchOverview();
    return () => console.log("[Overview] Cleanup on unmount 🧹");
  }, []);

  useEffect(() => {
        console.log("[Overview] overviewData changed 🧩", overviewData);
      }, [overviewData]);
    
      useEffect(() => {
        if (selectedItem) console.log("[Overview] Selected item changed 🟢", selectedItem.title);
      }, [selectedItem]);
    
      useEffect(() => {
        if (showChart) console.log("[Overview] showChart → true 🎨 rendering Doughnut");
      }, [showChart]);

  const handleClick = (item) => {
    setSelectedItem(item);
    setShowChart(false);
    setTimeout(() => setShowChart(true), 100);
  };

  const handleClose = () => {
    setSelectedItem(null);
    setShowChart(false);
  };

  if (loading) {
     return <div className="p-4 sm:p-6">{t("loading")}</div>;
  }

  
  if (error) {
    return <div className="p-4 sm:p-6 text-red-500">{t("error")}: {error}</div>;
  }

 
  
  
  return (
    <div className="p-3 sm:p-4 lg:p-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {overviewData.map((item, index) => (
          <div
            key={index}
            onClick={() => handleClick(item)}
            className={`${styles.metricCard} w-full p-3 sm:p-4 md:p-6 bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-opacity-20`}
            style={{ borderColor: colors.primary }}
          >
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3" style={{ color: colors.primary }}>
                {item.title}
              </h3>
              <p className={`${styles.value} text-2xl sm:text-3xl md:text-4xl`} style={{ color: colors.secondary }}>{item.value}</p>
              <p className="text-xs sm:text-sm" style={{ color: colors.primary, opacity: 0.7 }}>{item.description}</p>
            </div>
            <div className="mt-3 sm:mt-4 h-24 sm:h-28 md:h-32 w-full min-w-0 overflow-hidden">

              <Bar
                data={{
                  labels: item.metrics.map((metric) => metric.label),
                  datasets: [
                    {
                      label: "Metrics",
                      data: item.metrics.map((metric) => metric.value),
                      backgroundColor: [
                        `${colors.primary}cc`,
                        `${colors.secondary}cc`,
                        `${colors.primary}99`,
                        `${colors.secondary}99`
                      ],
                      borderColor: colors.white,
                      borderRadius: 6,
                      borderWidth: 1,
                      barThickness: 16,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { 
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: colors.white,
                      titleColor: colors.primary,
                      bodyColor: colors.primary,
                      borderColor: colors.primary,
                      borderWidth: 1,
                      padding: 10,
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                      callbacks: {
                        label: function(context) {
                          return `${context.dataset.label}: ${context.parsed.y}`;
                        }
                      }
                    }
                  },
                  scales: { 
                    x: { 
                      display: false,
                      grid: { display: false }
                    }, 
                    y: { 
                      display: false,
                      grid: { display: false }
                    } 
                  },
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Dynamic Metrics Modal */}
      {selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30 p-2 sm:p-4">
          <div className="bg-white p-3 sm:p-4 md:p-6 lg:p-8 rounded-lg sm:rounded-xl w-full max-w-xs sm:max-w-md md:max-w-2xl mx-auto max-h-[90vh] sm:max-h-[95vh] overflow-y-auto border border-opacity-20"
            style={{ borderColor: colors.primary }}>
            <h2 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: colors.primary }}>{selectedItem.title}</h2>
            <p className="mb-4 sm:mb-6 text-sm sm:text-base" style={{ color: colors.primary, opacity: 0.7 }}>{selectedItem.description}</p>

            {/* If the item is for generated stories, show the list */}
            {selectedItem.id === "generate-story" && selectedItem.stories && (
              <div className="bg-white p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl mb-4 sm:mb-6 border border-opacity-20"
                style={{ borderColor: colors.primary }}>
                <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3" style={{ color: colors.primary }}>Generated Stories</h3>
                <ul className="space-y-2 sm:space-y-3">
                  {selectedItem.stories.map((story) => (
                    <li key={story.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 sm:py-3 px-3 sm:px-4 bg-white rounded-lg shadow-sm border border-opacity-20 gap-2 sm:gap-0"
                      style={{ borderColor: colors.primary }}>
                      <span className="font-medium text-sm sm:text-base" style={{ color: colors.primary }}>{story.title}</span>
                      <div className="flex items-center justify-between sm:justify-end sm:space-x-3">
                        <span
                          style={{
                            backgroundColor: story.status === "Published" ? `${colors.secondary}33` : `${colors.primary}33`,
                            color: colors.primary,
                            padding: '0.2rem 0.4rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem sm:0.875rem',
                            fontWeight: 'bold'
                          }}
                        >
                          {story.status}
                        </span>
                        <a
                          href={story.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: colors.primary }}
                          className="p-1 rounded-full hover:bg-opacity-10"
                          style={{ backgroundColor: colors.primary + '10' }}
                          title={t("viewStory")}
                        >
                          <FaEye />
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Doughnut Chart */}
            <div className="bg-white p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border border-opacity-20"
              style={{ borderColor: colors.primary }}>
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3" style={{ color: colors.primary }}>
                {t("metricsOverview")}
              </h3>
              {showChart ? (
                <div className="relative h-48 sm:h-56 md:h-64">
                  <Doughnut
                    data={{
                      labels: selectedItem.metrics.map((metric) => metric.label),
                      datasets: [
                        {
                          data: selectedItem.metrics.map((metric) => metric.value),
                          backgroundColor: [
                            `${colors.primary}cc`,
                            `${colors.secondary}cc`,
                            `${colors.primary}99`,
                            `${colors.secondary}99`
                          ],
                          borderColor: colors.white,
                          borderWidth: 2,
                          cutout: '70%',
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { 
                        legend: { 
                          position: 'bottom',
                          labels: {
                            padding: 15,
                            usePointStyle: true,
                            pointStyle: 'circle',
                            font: {
                              family: 'Inter, sans-serif',
                              size: 11
                            },
                            color: colors.primary
                          }
                        },
                        tooltip: {
                          backgroundColor: colors.white,
                          titleColor: colors.primary,
                          bodyColor: colors.primary,
                          borderColor: colors.primary,
                          borderWidth: 1,
                          padding: 10,
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                          callbacks: {
                            label: function(context) {
                              const total = context.dataset.data.reduce((a, b) => a + b, 0);
                              const value = context.raw;
                              const percentage = Math.round((value / total) * 100);
                              return `${context.label}: ${value} (${percentage}%)`;
                            }
                          }
                        }
                      },
                      cutout: '65%',
                    }}
                    plugins={[doughnutLabelPlugin]}
                  />
                </div>
              ) : (
                <div className="h-48 sm:h-56 md:h-64 flex items-center justify-center">
                  <div className="animate-pulse flex space-x-4">
                    <div className="rounded-full" style={{ backgroundColor: `${colors.primary}20`, height: '2.5rem', width: '2.5rem' }}></div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleClose}
              className="mt-4 sm:mt-6 px-4 sm:px-6 py-2 rounded-lg transition-all shadow-sm hover:shadow-md w-full sm:w-auto text-sm sm:text-base"
              style={{ 
                backgroundColor: colors.primary,
                color: colors.white
              }}
            >
              {t("close")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;