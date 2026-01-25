import React, { useState, useEffect } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  Area,
  ReferenceLine
} from "recharts";
import { motion } from "framer-motion";
import { FiUsers, FiArrowUpRight } from "react-icons/fi";

const UserGrowthChart = () => {
  // Dummy data showing realistic growth pattern
  const dummyData = [
    { date: '2023-01', totalUsers: 1200, newUsers: 150 },
    { date: '2023-02', totalUsers: 1450, newUsers: 180 },
    { date: '2023-03', totalUsers: 1720, newUsers: 210 },
    { date: '2023-04', totalUsers: 1980, newUsers: 190 },
    { date: '2023-05', totalUsers: 2250, newUsers: 220 },
    { date: '2023-06', totalUsers: 2550, newUsers: 240 },
    { date: '2023-07', totalUsers: 2900, newUsers: 280 },
    { date: '2023-08', totalUsers: 3250, newUsers: 300 },
    { date: '2023-09', totalUsers: 3600, newUsers: 290 },
    { date: '2023-10', totalUsers: 4000, newUsers: 350 },
    { date: '2023-11', totalUsers: 4400, newUsers: 380 },
    { date: '2023-12', totalUsers: 4850, newUsers: 400 }
  ];

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSeries, setActiveSeries] = useState(['totalUsers', 'newUsers']);
  const [growthRate, setGrowthRate] = useState(0);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setData(dummyData);
      
      // Calculate overall growth rate
      const start = dummyData[0].totalUsers;
      const end = dummyData[dummyData.length - 1].totalUsers;
      const rate = ((end - start) / start * 100).toFixed(1);
      setGrowthRate(rate);
      
      setIsLoading(false);
    }, 1200);
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

  const lineVariants = {
    hidden: { opacity: 0, pathLength: 0 },
    visible: { 
      opacity: 1, 
      pathLength: 1,
      transition: {
        duration: 1.5,
        ease: "easeInOut"
      }
    }
  };

  // Custom tooltip with growth calculation
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Find previous month's data for growth calculation
      const currentIndex = data.findIndex(item => item.date === label);
      const prevData = currentIndex > 0 ? data[currentIndex - 1] : null;
      
      return (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 shadow-lg rounded-lg border border-gray-200"
        >
          <h4 className="font-bold text-[#30B349] mb-2">
            {new Date(label).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h4>
          
          {payload.map((item, index) => (
            <div key={index} className="flex items-center mb-1">
              <div 
                className="w-3 h-3 rounded-sm mr-2"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-gray-600 mr-2">{item.name}:</span>
              <span className="font-semibold">{item.value.toLocaleString()}</span>
              
              {prevData && item.dataKey === 'totalUsers' && (
                <span className="ml-2 text-xs flex items-center">
                  (<span className="text-[#8CC43D] font-medium flex items-center">
                    <FiArrowUpRight className="mr-0.5" size={12} />
                    {(((item.value - prevData.totalUsers) / prevData.totalUsers) * 100).toFixed(1)}%
                  </span>)
                </span>
              )}
            </div>
          ))}
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
        className="flex justify-center gap-4 mt-4"
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
            onClick={() => {
              if (activeSeries.includes(entry.dataKey)) {
                setActiveSeries(activeSeries.filter(key => key !== entry.dataKey));
              } else {
                setActiveSeries([...activeSeries, entry.dataKey]);
              }
            }}
            style={{
              opacity: activeSeries.includes(entry.dataKey) ? 1 : 0.3,
              transition: 'opacity 0.2s ease'
            }}
          >
            <span 
              className="w-3 h-3 rounded-sm mr-2"
              style={{ backgroundColor: entry.color }}
            />
            {entry.value}
          </motion.li>
        ))}
      </motion.ul>
    );
  };

  // Custom active dot
  const CustomActiveDot = (props) => {
    const { cx, cy, stroke } = props;
    return (
      <motion.circle
        cx={cx}
        cy={cy}
        r={6}
        stroke={stroke}
        strokeWidth={2}
        fill="#fff"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500 }}
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
          <FiUsers className="text-[#30B349] mr-2 text-xl" />
          <h3 className="text-xl font-bold text-[#30B349]">User Growth Trend</h3>
        </div>
        <div className="flex items-center text-xs bg-[#8CC43D]/20 text-[#30B349] px-2 py-1 rounded-full">
          <span className="font-medium">{growthRate}%</span>
          <FiArrowUpRight className="ml-1" />
        </div>
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
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false}
              stroke="#eee"
            />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short' })}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#666', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#666', fontSize: 12 }}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ stroke: '#8CC43D', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Legend 
              content={renderCustomizedLegend}
            />
            <ReferenceLine 
              y={3000} 
              stroke="#30B349"
              strokeDasharray="4 4"
              strokeOpacity={0.3}
              label={{
                position: 'left',
                value: '3K Milestone',
                fill: '#30B349',
                fontSize: 12,
                opacity: 0.7
              }}
            />
            {activeSeries.includes('totalUsers') && (
              <Line
                type="monotone"
                dataKey="totalUsers"
                name="Total Users"
                stroke="#30B349"
                strokeWidth={3}
                dot={false}
                activeDot={<CustomActiveDot />}
                animationDuration={1500}
              >
                <motion.path
                  variants={lineVariants}
                  initial="hidden"
                  animate="visible"
                />
              </Line>
            )}
            {activeSeries.includes('newUsers') && (
              <Line
                type="monotone"
                dataKey="newUsers"
                name="New Users"
                stroke="#8CC43D"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
                activeDot={<CustomActiveDot />}
                animationDuration={1500}
              >
                <motion.path
                  variants={lineVariants}
                  initial="hidden"
                  animate="visible"
                />
              </Line>
            )}
          </LineChart>
        </ResponsiveContainer>
      )}
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>Showing monthly user growth from {data[0]?.date} to {data[data.length - 1]?.date}</p>
      </div>
    </motion.div>
  );
};

export default UserGrowthChart;