import React, { useState } from "react";
import { motion } from "framer-motion";
import ActivityByHourChart from "./charts/ActivityByHourChart";
import ActivityByRegionChart from "./charts/ActivityByRegionChart";
import UserGrowthChart from "./charts/UserGrowthChart";
import ActionDistributionChart from "./charts/ActionDistributionChart";
import RetentionTrendChart from "./charts/RetentionTrendChart";
import TopRegionsChart from "./charts/TopRegionsChart";
import { FiActivity, FiTrendingUp, FiUsers, FiPieChart, FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function Analytics({ data }) {
  // Destructure with safe defaults
  const { 
    activeData = {}, 
    retentionData = {}, 
    byHour = [], 
    byRegion = [], 
    userGrowth = [], 
    byAction = [], 
    retentionTrend = [] 
  } = data || {};

  // State for mobile accordion sections
  const [openSections, setOpenSections] = useState({
    summary: true,
    activity: true,
    userAnalytics: true,
    distribution: true
  });

  // Toggle section visibility on mobile
  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Dummy values for presentation (only used if backend returns nothing)
  const dummyActive = { dailyActiveUsers: 120, weeklyActiveUsers: 540 };
  const dummyRetention = { retentionRate: 47.3 };

  // Merge backend data with dummy fallback
  const dailyUsers =
    typeof activeData.dailyActiveUsers === "number"
      ? activeData.dailyActiveUsers
      : dummyActive.dailyActiveUsers;

  const weeklyUsers =
    typeof activeData.weeklyActiveUsers === "number"
      ? activeData.weeklyActiveUsers
      : dummyActive.weeklyActiveUsers;

  const retentionRate =
    typeof retentionData.retentionRate === "number"
      ? retentionData.retentionRate
      : dummyRetention.retentionRate;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6 md:space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h2 className="text-xl md:text-2xl font-bold text-[#30B349] flex items-center">
          <FiActivity className="mr-2" /> Analytics Overview
        </h2>
      </motion.div>

      {/* Summary cards - Mobile Accordion */}
      <motion.div variants={itemVariants} className="lg:hidden">
        <div 
          className="bg-white p-4 rounded-lg shadow-md border border-gray-200 cursor-pointer"
          onClick={() => toggleSection('summary')}
        >
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-[#30B349]">Summary Metrics</h3>
            {openSections.summary ? <FiChevronUp /> : <FiChevronDown />}
          </div>
        </div>
        
        {openSections.summary && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 grid grid-cols-1 gap-4"
          >
            {/* Active Users */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h4 className="font-medium text-[#30B349] mb-2">Active Users</h4>
              <div className="space-y-2">
                <p className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Daily:</span>
                  <span className="font-bold">{dailyUsers}</span>
                </p>
                <p className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Weekly:</span>
                  <span className="font-bold">{weeklyUsers}</span>
                </p>
              </div>
            </div>

            {/* Retention */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h4 className="font-medium text-[#30B349] mb-2">Retention</h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Retention Rate</p>
                  <p className="text-xs text-gray-500">Users returning after 7 days</p>
                </div>
                <span className="font-bold text-lg">{retentionRate.toFixed(1)}%</span>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Summary cards - Desktop */}
      <motion.div 
        variants={itemVariants}
        className="hidden lg:grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
      >
        {/* Active Users */}
        <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm md:shadow-lg border border-gray-100">
          <h3 className="font-semibold text-[#30B349] mb-3">Active Users</h3>
          <div className="space-y-2">
            <p className="flex justify-between items-center">
              <span className="text-gray-600">Daily:</span>
              <span className="font-bold text-lg">{dailyUsers}</span>
            </p>
            <p className="flex justify-between items-center">
              <span className="text-gray-600">Weekly:</span>
              <span className="font-bold text-lg">{weeklyUsers}</span>
            </p>
          </div>
        </div>

        {/* Retention */}
        <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm md:shadow-lg border border-gray-100">
          <h3 className="font-semibold text-[#30B349] mb-3">Retention</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Retention Rate</p>
              <p className="text-sm text-gray-500">Users returning after 7 days</p>
            </div>
            <span className="font-bold text-xl">{retentionRate.toFixed(1)}%</span>
          </div>
        </div>
      </motion.div>

      {/* Activity Metrics Section - Mobile Accordion */}
      <motion.div variants={itemVariants} className="lg:hidden">
        <div 
          className="bg-white p-4 rounded-lg shadow-md border border-gray-200 cursor-pointer"
          onClick={() => toggleSection('activity')}
        >
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-[#30B349] flex items-center">
              <FiTrendingUp className="mr-2" /> Activity Metrics
            </h3>
            {openSections.activity ? <FiChevronUp /> : <FiChevronDown />}
          </div>
        </div>
        
        {openSections.activity && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 space-y-4"
          >
            <div className="bg-white p-3 rounded-lg border border-gray-100">
              <ActivityByHourChart data={byHour.length > 0 ? byHour : null} />
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-100">
              <ActivityByRegionChart data={byRegion.length > 0 ? byRegion : null} />
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Activity Metrics Section - Desktop */}
      <motion.div variants={itemVariants} className="hidden lg:block">
        <h3 className="text-lg md:text-xl font-semibold text-[#30B349] flex items-center mt-6 md:mt-8 mb-4">
          <FiTrendingUp className="mr-2" /> Activity Metrics
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white p-4 rounded-lg border border-gray-100">
            <ActivityByHourChart data={byHour.length > 0 ? byHour : null} />
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-100">
            <ActivityByRegionChart data={byRegion.length > 0 ? byRegion : null} />
          </div>
        </div>
      </motion.div>

      {/* User Analytics Section - Mobile Accordion */}
      <motion.div variants={itemVariants} className="lg:hidden">
        <div 
          className="bg-white p-4 rounded-lg shadow-md border border-gray-200 cursor-pointer"
          onClick={() => toggleSection('userAnalytics')}
        >
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-[#30B349] flex items-center">
              <FiUsers className="mr-2" /> User Analytics
            </h3>
            {openSections.userAnalytics ? <FiChevronUp /> : <FiChevronDown />}
          </div>
        </div>
        
        {openSections.userAnalytics && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 space-y-4"
          >
            <div className="bg-white p-3 rounded-lg border border-gray-100">
              <UserGrowthChart data={userGrowth.length > 0 ? userGrowth : null} />
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-100">
              <RetentionTrendChart data={retentionTrend.length > 0 ? retentionTrend : null} />
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* User Analytics Section - Desktop */}
      <motion.div variants={itemVariants} className="hidden lg:block">
        <h3 className="text-lg md:text-xl font-semibold text-[#30B349] flex items-center mt-6 md:mt-8 mb-4">
          <FiUsers className="mr-2" /> User Analytics
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white p-4 rounded-lg border border-gray-100">
            <UserGrowthChart data={userGrowth.length > 0 ? userGrowth : null} />
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-100">
            <RetentionTrendChart data={retentionTrend.length > 0 ? retentionTrend : null} />
          </div>
        </div>
      </motion.div>

      {/* Distribution Metrics Section - Mobile Accordion */}
      <motion.div variants={itemVariants} className="lg:hidden">
        <div 
          className="bg-white p-4 rounded-lg shadow-md border border-gray-200 cursor-pointer"
          onClick={() => toggleSection('distribution')}
        >
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-[#30B349] flex items-center">
              <FiPieChart className="mr-2" /> Distribution Metrics
            </h3>
            {openSections.distribution ? <FiChevronUp /> : <FiChevronDown />}
          </div>
        </div>
        
        {openSections.distribution && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 space-y-4"
          >
            <div className="bg-white p-3 rounded-lg border border-gray-100">
              <ActionDistributionChart data={byAction.length > 0 ? byAction : null} />
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-100">
              <TopRegionsChart data={byRegion.length > 0 ? byRegion : null} />
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Distribution Metrics Section - Desktop */}
      <motion.div variants={itemVariants} className="hidden lg:block">
        <h3 className="text-lg md:text-xl font-semibold text-[#30B349] flex items-center mt-6 md:mt-8 mb-4">
          <FiPieChart className="mr-2" /> Distribution Metrics
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white p-4 rounded-lg border border-gray-100">
            <ActionDistributionChart data={byAction.length > 0 ? byAction : null} />
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-100">
            <TopRegionsChart data={byRegion.length > 0 ? byRegion : null} />
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}