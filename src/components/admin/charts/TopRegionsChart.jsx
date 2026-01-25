import React, { useState, useEffect } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  LabelList
} from "recharts";
import { motion } from "framer-motion";
import { FiMapPin } from "react-icons/fi";

const TopRegionsChart = () => {
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
  const [totalCount, setTotalCount] = useState(0);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      const top5 = dummyData.slice(0, 5);
      setData(top5);
      setTotalCount(top5.reduce((sum, item) => sum + item.count, 0));
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const barVariants = {
    hidden: { opacity: 0, scaleY: 0 },
    visible: { 
      opacity: 1, 
      scaleY: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100
      }
    }
  };

  // Custom tooltip with proper percentage calculation
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / totalCount) * 100).toFixed(1);
      return (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-3 shadow-lg rounded-lg border border-gray-200"
        >
          <p className="font-bold text-[#30B349]">{label}</p>
          <div className="flex items-center mt-1">
            <div className="w-3 h-3 rounded-sm bg-[#8CC43D] mr-2"></div>
            <p className="text-gray-700">
              <span className="font-semibold">{payload[0].value}</span> users
            </p>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {percentage}% of top regions total
          </p>
        </motion.div>
      );
    }
    return null;
  };

  // Custom bar shape with animation
  const CustomBar = (props) => {
    const { fill, x, y, width, height } = props;
    return (
      <motion.rect
        variants={barVariants}
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        rx={4} // Rounded corners
        ry={4} // Rounded corners
        initial="hidden"
        animate="visible"
      />
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
          <FiMapPin className="text-[#30B349] mr-2 text-xl" />
          <h3 className="text-xl font-bold text-[#30B349]">Top Regions by Users</h3>
        </div>
        <span className="text-xs bg-[#8CC43D]/20 text-[#30B349] px-2 py-1 rounded-full">
          Top 5 Regions
        </span>
      </div>
      
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center w-full">
            <div className="h-48 w-full bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            layout="vertical" // Horizontal bars
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              horizontal={true}
              vertical={false}
              stroke="#eee"
            />
            <XAxis 
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#666', fontSize: 12 }}
            />
            <YAxis 
              dataKey="_id" 
              type="category"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#666', fontSize: 12 }}
              width={100}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ fill: '#8CC43D10' }}
            />
            <Legend 
              content={() => (
                <div className="text-center mt-2 text-sm text-gray-600">
                  User count by region
                </div>
              )}
            />
            <Bar 
              dataKey="count" 
              name="Users"
              fill="#8CC43D"
              shape={<CustomBar />}
              animationDuration={1500}
            >
              <LabelList
                dataKey="count"
                position="right"
                formatter={(value) => value.toLocaleString()}
                fill="#666"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>Showing top 5 regions by user count (total: {totalCount.toLocaleString()})</p>
      </div>
    </motion.div>
  );
};

export default TopRegionsChart;