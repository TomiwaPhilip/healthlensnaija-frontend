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

const ActivityByHourChart = () => {
  // Dummy data with realistic hourly pattern
  const dummyData = [
    { _id: 0, count: 12 },
    { _id: 1, count: 8 },
    { _id: 2, count: 5 },
    { _id: 3, count: 4 },
    { _id: 4, count: 6 },
    { _id: 5, count: 15 },
    { _id: 6, count: 32 },
    { _id: 7, count: 45 },
    { _id: 8, count: 68 },
    { _id: 9, count: 84 },
    { _id: 10, count: 92 },
    { _id: 11, count: 105 },
    { _id: 12, count: 120 },
    { _id: 13, count: 115 },
    { _id: 14, count: 108 },
    { _id: 15, count: 98 },
    { _id: 16, count: 85 },
    { _id: 17, count: 72 },
    { _id: 18, count: 65 },
    { _id: 19, count: 54 },
    { _id: 20, count: 42 },
    { _id: 21, count: 35 },
    { _id: 22, count: 28 },
    { _id: 23, count: 18 }
  ];

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const totalCount = dummyData.reduce((sum, item) => sum + item.count, 0);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setData(dummyData);
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Format data for chart
  const chartData = data.map(item => ({ 
    hour: `${item._id}:00`, 
    count: item.count,
    ampm: item._id >= 12 ? 'PM' : 'AM',
    hour12: item._id % 12 === 0 ? 12 : item._id % 12
  }));

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

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-3 shadow-lg rounded-lg border border-gray-200"
        >
          <p className="font-bold text-[#30B349]">
            {data.hour12}:00 {data.ampm}
          </p>
          <div className="flex items-center mt-1">
            <div className="w-3 h-3 rounded-sm bg-[#8CC43D] mr-2"></div>
            <p className="text-gray-700">
              <span className="font-semibold">{payload[0].value}</span> actions
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-1">
          { Math.round((payload[0].value / totalCount) * 100) }% of daily total

          </p>
        </motion.div>
      );
    }
    return null;
  };

  // Custom axis tick
  const CustomXAxisTick = ({ x, y, payload }) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text 
          x={0} 
          y={0} 
          dy={16} 
          textAnchor="middle" 
          fill="#666" 
          fontSize={12}
        >
          {payload.value.split(':')[0]}
        </text>
        <text 
          x={0} 
          y={15} 
          dy={16} 
          textAnchor="middle" 
          fill="#999" 
          fontSize={10}
        >
          {payload.value.split(':')[0] >= 12 ? 'PM' : 'AM'}
        </text>
      </g>
    );
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
        <h3 className="text-xl font-bold text-[#30B349]">Hourly Activity Pattern</h3>
        <span className="text-xs bg-[#8CC43D]/20 text-[#30B349] px-2 py-1 rounded-full">
          Last 24 Hours
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
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false}
              stroke="#eee"
            />
            <XAxis 
              dataKey="hour" 
              tick={<CustomXAxisTick />}
              axisLine={false}
              tickLine={false}
              interval={0}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#666', fontSize: 12 }}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ fill: '#8CC43D10' }}
            />
            <Legend 
              content={() => (
                <div className="text-center mt-2 text-sm text-gray-600">
                  User activity count by hour
                </div>
              )}
            />
            <Bar 
              dataKey="count" 
              name="Actions"
              fill="#8CC43D"
              shape={<CustomBar />}
              animationDuration={1500}
            >
              <LabelList
                dataKey="count"
                position="top"
                formatter={(value) => value > 30 ? value : ''}
                fill="#666"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>Peak activity typically occurs between 12PM-2PM</p>
      </div>
    </motion.div>
  );
};

export default ActivityByHourChart;