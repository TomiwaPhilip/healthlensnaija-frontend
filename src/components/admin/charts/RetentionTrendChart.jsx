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
import { FiTrendingUp, FiCalendar } from "react-icons/fi";

const RetentionTrendChart = () => {
  // Dummy data showing realistic retention trends
  const dummyData = [
    { month: 'Jan', activeUsers: 4200, newUsers: 1200 },
    { month: 'Feb', activeUsers: 4800, newUsers: 1500 },
    { month: 'Mar', activeUsers: 5100, newUsers: 1800 },
    { month: 'Apr', activeUsers: 4900, newUsers: 1400 },
    { month: 'May', activeUsers: 5300, newUsers: 1600 },
    { month: 'Jun', activeUsers: 5700, newUsers: 1900 },
    { month: 'Jul', activeUsers: 6200, newUsers: 2200 },
    { month: 'Aug', activeUsers: 6500, newUsers: 2400 },
    { month: 'Sep', activeUsers: 6800, newUsers: 2100 },
    { month: 'Oct', activeUsers: 7200, newUsers: 2500 },
    { month: 'Nov', activeUsers: 7500, newUsers: 2800 },
    { month: 'Dec', activeUsers: 8000, newUsers: 3000 }
  ];

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSeries, setActiveSeries] = useState(['activeUsers', 'newUsers']);



  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setData(dummyData);
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

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const currentValue = payload[0].value;
      const prevValue = payload[0].payload.prevValue;
      const percentChange = prevValue
        ? (((currentValue - prevValue) / prevValue) * 100).toFixed(1)
        : '–';
  
      return (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 shadow-lg rounded-lg border border-gray-200"
        >
          <h4 className="font-bold text-[#30B349] mb-2">{label}</h4>
          {payload.map((item, index) => (
            <div key={index} className="flex items-center mb-1">
              <div 
                className="w-3 h-3 rounded-sm mr-2"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-gray-600 mr-2">{item.name}:</span>
              <span className="font-semibold">{item.value}</span>
            </div>
          ))}
          {payload.length > 1 && (
            <div className="mt-2 pt-2 border-t border-gray-100 text-sm">
              <span className="text-gray-500">Growth: </span>
              <span className="font-medium text-[#8CC43D]">
                +{percentChange}%
              </span>
            </div>
          )}
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
          <FiTrendingUp className="text-[#30B349] mr-2 text-xl" />
          <h3 className="text-xl font-bold text-[#30B349]">User Retention Trend</h3>
        </div>
        <div className="flex items-center text-xs bg-[#8CC43D]/20 text-[#30B349] px-2 py-1 rounded-full">
          <FiCalendar className="mr-1" />
          Last 12 Months
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
            data={data.map((d, i) => ({
              ...d,
              prevValue: i > 0 ? data[i-1].activeUsers : d.activeUsers
            }))}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false}
              stroke="#eee"
            />
            <XAxis 
              dataKey="month" 
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
              y={6000} 
              stroke="#30B349"
              strokeDasharray="4 4"
              strokeOpacity={0.3}
              label={{
                position: 'left',
                value: '6K Target',
                fill: '#30B349',
                fontSize: 12,
                opacity: 0.7
              }}
            />
            {activeSeries.includes('activeUsers') && (
              <Line
                type="monotone"
                dataKey="activeUsers"
                name="Active Users"
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
        <p>Showing monthly active users and new user acquisition trends</p>
      </div>
    </motion.div>
  );
};

export default RetentionTrendChart;