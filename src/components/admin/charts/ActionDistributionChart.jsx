import React, { useState, useEffect } from "react";
import { PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const ActionDistributionChart = () => {
  // Dummy data with more interesting categories
  const dummyData = [
    { _id: "Story Creation", count: 45 },
    { _id: "AI Chat", count: 78 },
    { _id: "Document Upload", count: 32 },
    { _id: "Profile Update", count: 12 },
    { _id: "Content Sharing", count: 56 },
    { _id: "Search Queries", count: 89 },
  ];

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data loading with animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setData(dummyData);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Custom color palette using your brand colors
  const COLORS = [
    "#30B349", // Primary green
    "#8CC43D", // Secondary green
    "#2C7BE5", // Blue
    "#F5803E", // Orange
    "#6E51F0", // Purple
    "#FFC658", // Yellow
  ];

  // Process data for chart
  const chartData = data.map(item => ({ 
    name: item._id, 
    value: item.count,
    percentage: ((item.count / dummyData.reduce((sum, item) => sum + item.count, 0)) * 100).toFixed(1)
  }));

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        staggerChildren: 0.2,
        when: "beforeChildren"
      } 
    }
  };

  const pieVariants = {
    hidden: { scale: 0 },
    visible: { 
      scale: 1,
      transition: { 
        type: "spring",
        damping: 10,
        stiffness: 100
      }
    }
  };

  // Custom tooltip styling
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-3 shadow-lg rounded-lg border border-gray-200"
        >
          <p className="font-semibold text-[#30B349]">{payload[0].name}</p>
          <p className="text-gray-600">{payload[0].value} actions</p>
          <p className="text-sm text-gray-500">{payload[0].payload.percentage}% of total</p>
        </motion.div>
      );
    }
    return null;
  };

  // Custom legend styling
  const renderCustomizedLegend = (props) => {
    const { payload } = props;
    return (
      <motion.ul 
        className="flex flex-wrap justify-center gap-2 mt-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {payload.map((entry, index) => (
          <motion.li 
            key={`item-${index}`}
            className="flex items-center text-xs"
            variants={{
              hidden: { opacity: 0, x: -10 },
              visible: { opacity: 1, x: 0 }
            }}
          >
            <span 
              className="w-3 h-3 rounded-full mr-1"
              style={{ backgroundColor: entry.color }}
            />
            {entry.value}
          </motion.li>
        ))}
      </motion.ul>
    );
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-[#30B349]">User Action Distribution</h3>
        <span className="text-xs bg-[#8CC43D]/20 text-[#30B349] px-2 py-1 rounded-full">
          Real-time Data
        </span>
      </div>
      
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-gray-200 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      ) : (
        <motion.div variants={pieVariants}>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                innerRadius={60}
                paddingAngle={2}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                labelLine={false}
                animationBegin={200}
                animationDuration={1000}
                animationEasing="ease-out"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    stroke="#fff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip 
                content={<CustomTooltip />}
                wrapperStyle={{ zIndex: 1000 }}
              />
              <Legend 
                content={renderCustomizedLegend}
                wrapperStyle={{ paddingTop: '20px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      )}
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>Hover over segments for details. Click legend items to toggle visibility.</p>
      </div>
    </motion.div>
  );
};

export default ActionDistributionChart;