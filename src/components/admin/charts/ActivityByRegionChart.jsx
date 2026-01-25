import React, { useState, useEffect } from "react";
import { PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { FiGlobe } from "react-icons/fi";

const ActivityByRegionChart = () => {
  // Dummy data with realistic regions
  const dummyData = [
    { _id: "North America", count: 1250 },
    { _id: "Europe", count: 980 },
    { _id: "Asia", count: 870 },
    { _id: "South America", count: 420 },
    { _id: "Africa", count: 310 },
    { _id: "Oceania", count: 180 },
  ];

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);

  // Simulate data loading
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
    name: item._id || "Unknown", 
    value: item.count,
    percentage: ((item.count / dummyData.reduce((sum, item) => sum + item.count, 0)) * 100).toFixed(1)
  }));

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
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

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-3 shadow-lg rounded-lg border border-gray-200"
        >
          <p className="font-semibold text-[#30B349]">{payload[0].name}</p>
          <div className="flex items-center mt-1">
            <div 
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: payload[0].payload.fill }}
            />
            <p className="text-gray-600">
              <span className="font-semibold">{payload[0].value}</span> users
            </p>
          </div>
          <p className="text-sm text-gray-500 mt-1">{payload[0].payload.percentage}% of total</p>
        </motion.div>
      );
    }
    return null;
  };

  // Custom legend with interactivity
  const renderCustomizedLegend = (props) => {
    const { payload } = props;
    return (
      <motion.ul 
        className="flex flex-wrap justify-center gap-3 mt-4"
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
            className="flex items-center text-sm cursor-pointer"
            variants={{
              hidden: { opacity: 0, y: -10 },
              visible: { opacity: 1, y: 0 }
            }}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            style={{
              opacity: activeIndex === null || activeIndex === index ? 1 : 0.5,
              transition: 'opacity 0.2s ease'
            }}
          >
            <span 
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            />
            {entry.value}
          </motion.li>
        ))}
      </motion.ul>
    );
  };

  // Custom active shape for pie segments
  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;
    
    return (
      <g>
        <motion.path
          d={`
            M${cx},${cy}
            L${cx},${cy - outerRadius}
            A${outerRadius * 1.05},${outerRadius * 1.05} 0 0,1 ${cx + outerRadius * 1.05 * Math.sin(endAngle)},${cy - outerRadius * 1.05 * Math.cos(endAngle)}
            L${cx},${cy}
            Z
          `}
          fill={fill}
          initial={{ scale: 1 }}
          animate={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
        <text 
          x={cx} 
          y={cy} 
          dy={8} 
          textAnchor="middle" 
          fill="#fff" 
          fontSize={12}
          fontWeight="bold"
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      </g>
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
        <div className="flex items-center">
          <FiGlobe className="text-[#30B349] mr-2 text-xl" />
          <h3 className="text-xl font-bold text-[#30B349]">Regional Activity</h3>
        </div>
        <span className="text-xs bg-[#8CC43D]/20 text-[#30B349] px-2 py-1 rounded-full">
          Global
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
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                innerRadius={70}
                paddingAngle={2}
                animationBegin={200}
                animationDuration={1000}
                animationEasing="ease-out"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
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
        <p>Hover over regions to highlight their segment</p>
      </div>
    </motion.div>
  );
};

export default ActivityByRegionChart;