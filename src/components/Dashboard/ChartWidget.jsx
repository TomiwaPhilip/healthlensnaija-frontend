// src/components/Dashboard/ChartWidget.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import {
  FiSettings, 
  FiMaximize, 
  FiMinimize, 
  FiDownload,
  FiFilter,
  FiRefreshCw
} from 'react-icons/fi';
import { 
  IconButton, 
  Menu, 
  MenuItem, 
  Divider,
  FormControl,
  InputLabel,
  Select,
  Button,
  TextField,
  Switch,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const chartTypes = {
  bar: { name: 'Bar Chart', type: 'bar' },
  line: { name: 'Line Chart', type: 'line' },
  area: { name: 'Area Chart', type: 'line' },
  pie: { name: 'Pie Chart', type: 'pie' },
  doughnut: { name: 'Doughnut Chart', type: 'doughnut' },
  radar: { name: 'Radar Chart', type: 'radar' },
};

// Beautiful green gradient color palettes
const colorPalettes = {
  greenGradient: [
    'rgba(48, 179, 73, 1)',     // #30B349 - Primary Green
    'rgba(140, 196, 61, 1)',    // #8CC43D - Lime Green
    'rgba(67, 217, 173, 1)',    // #43D9AD - Teal Green
    'rgba(52, 199, 89, 1)',     // #34C759 - Apple Green
    'rgba(76, 217, 100, 1)',    // #4CD964 - Bright Green
    'rgba(88, 232, 116, 1)',    // #58E874 - Light Green
  ],
  greenGradientLight: [
    'rgba(48, 179, 73, 0.8)',
    'rgba(140, 196, 61, 0.8)',
    'rgba(67, 217, 173, 0.8)',
    'rgba(52, 199, 89, 0.8)',
    'rgba(76, 217, 100, 0.8)',
    'rgba(88, 232, 116, 0.8)',
  ],
  greenMonochromatic: [
    'rgba(48, 179, 73, 1)',
    'rgba(48, 179, 73, 0.8)',
    'rgba(48, 179, 73, 0.6)',
    'rgba(48, 179, 73, 0.4)',
    'rgba(48, 179, 73, 0.2)',
  ]
};

const ChartWidget = ({ 
  data, 
  title, 
  initialChartType = 'bar',
  initialWidth = 400,
  initialHeight = 300,
  onRemove,
  onUpdate,
  onRefresh,
  isTemplate = false
}) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const containerRef = useRef(null);
  const [settingsAnchor, setSettingsAnchor] = useState(null);
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [chartType, setChartType] = useState(initialChartType);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [colorPalette, setColorPalette] = useState('greenGradient');
  const [showGrid, setShowGrid] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [filters, setFilters] = useState({});
  const [filteredData, setFilteredData] = useState(data);
  const [isLive, setIsLive] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Create gradient backgrounds
  const createGradient = (ctx, color, isArea = false) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    if (isArea) {
      gradient.addColorStop(0, color.replace('1)', '0.6)'));
      gradient.addColorStop(1, color.replace('1)', '0.1)'));
    } else {
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, color.replace('1)', '0.7)'));
    }
    return gradient;
  };

  // Initialize chart
  useEffect(() => {
    if (chartRef.current && filteredData && filteredData.length > 0) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      const labels = filteredData.map(item => item.name || item.label || item.x);
      const datasets = [];
      
      // Get all data keys except name/label/x
      const dataKeys = Object.keys(filteredData[0]).filter(
        key => !['name', 'label', 'x', 'y', 'r'].includes(key)
      );

      if (dataKeys.length > 0) {
        // For standard charts
        dataKeys.forEach((key, idx) => {
          const baseColor = colorPalettes[colorPalette][idx % colorPalettes[colorPalette].length];
          const isAreaChart = chartType === 'area';
          
          datasets.push({
            label: key,
            data: filteredData.map(item => item[key]),
            backgroundColor: isAreaChart 
              ? createGradient(ctx, baseColor, true)
              : createGradient(ctx, baseColor),
            borderColor: baseColor,
            borderWidth: chartType === 'line' || chartType === 'area' ? 3 : 2,
            borderDash: chartType === 'line' ? [] : undefined,
            pointBackgroundColor: baseColor,
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: chartType === 'line' || chartType === 'area' ? 4 : 0,
            pointHoverRadius: 6,
            fill: chartType === 'area',
            tension: chartType === 'line' || chartType === 'area' ? 0.4 : 0,
            borderRadius: chartType === 'bar' ? 8 : 0,
            barPercentage: chartType === 'bar' ? 0.7 : 1,
            categoryPercentage: chartType === 'bar' ? 0.8 : 1,
          });
        });
      } else {
        // For single dataset charts
        const baseColor = colorPalettes[colorPalette][0];
        datasets.push({
          label: title || 'Data',
          data: filteredData,
          backgroundColor: createGradient(ctx, baseColor),
          borderColor: baseColor,
          borderWidth: 2,
        });
      }

      chartInstance.current = new Chart(ctx, {
        type: chartTypes[chartType].type,
        data: {
          labels,
          datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: {
              top: 20,
              right: 20,
              bottom: 10,
              left: 10
            }
          },
          scales: {
            x: {
              grid: {
                display: showGrid,
                color: 'rgba(0, 0, 0, 0.05)',
                drawBorder: false,
              },
              ticks: {
                font: {
                  family: "'Inter', sans-serif",
                  size: 11
                },
                color: '#6B7280'
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                display: showGrid,
                color: 'rgba(0, 0, 0, 0.05)',
                drawBorder: false,
              },
              ticks: {
                font: {
                  family: "'Inter', sans-serif",
                  size: 11
                },
                color: '#6B7280',
                padding: 10
              }
            }
          },
          plugins: {
            legend: {
              display: showLegend,
              position: 'top',
              labels: {
                usePointStyle: true,
                pointStyle: 'circle',
                padding: 20,
                font: {
                  family: "'Inter', sans-serif",
                  size: 12,
                  weight: '500'
                },
                color: '#374151'
              }
            },
            tooltip: {
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              titleColor: '#1F2937',
              bodyColor: '#374151',
              borderColor: 'rgba(229, 231, 235, 0.8)',
              borderWidth: 1,
              padding: 12,
              cornerRadius: 8,
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              titleFont: {
                family: "'Inter', sans-serif",
                size: 12,
                weight: '600'
              },
              bodyFont: {
                family: "'Inter', sans-serif",
                size: 11
              },
              usePointStyle: true,
              callbacks: {
                label: function(context) {
                  return `${context.dataset.label}: ${context.parsed.y}`;
                }
              }
            }
          },
          interaction: {
            intersect: false,
            mode: 'index',
          },
          animations: {
            tension: {
              duration: 1000,
              easing: 'easeOutQuart'
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartType, filteredData, colorPalette, showGrid, showLegend]);

  // Real-time updates
  useEffect(() => {
    let interval;
    if (isLive && onRefresh) {
      interval = setInterval(() => {
        onRefresh();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isLive, onRefresh]);

  // Apply filters
  useEffect(() => {
    if (!data) return;
    
    let result = [...data];
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter(item => {
          if (typeof item[key] === 'number') {
            return item[key] >= value.min && item[key] <= value.max;
          }
          return String(item[key]).toLowerCase().includes(String(value).toLowerCase());
        });
      }
    });
    setFilteredData(result);
  }, [data, filters]);

  const handleExport = async (format) => {
    if (!chartRef.current) return;
    
    try {
      const canvas = await html2canvas(chartRef.current);
      
      if (format === 'png') {
        const link = document.createElement('a');
        link.download = `${title || 'chart'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } else if (format === 'pdf') {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('landscape');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${title || 'chart'}.pdf`);
      }
    } catch (error) {
      console.error('Error exporting chart:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setFilters({});
    setFilteredData(data);
  };

  const settingsMenu = (
    <>
      <MenuItem disabled>Chart Type</MenuItem>
      {Object.keys(chartTypes).map(type => (
        <MenuItem 
          key={type} 
          onClick={() => { 
            setChartType(type); 
            setSettingsAnchor(null);
            setSettingsDialogOpen(false);
            if (onUpdate) onUpdate({ chartType: type });
          }}
        >
          {chartTypes[type].name}
        </MenuItem>
      ))}
      <Divider />

      <MenuItem disabled>Color Theme</MenuItem>
      <MenuItem 
        onClick={() => { 
          setColorPalette('greenGradient'); 
          setSettingsAnchor(null);
          setSettingsDialogOpen(false);
        }}
      >
        Green Gradient
      </MenuItem>
      <MenuItem 
        onClick={() => { 
          setColorPalette('greenGradientLight'); 
          setSettingsAnchor(null);
          setSettingsDialogOpen(false);
        }}
      >
        Light Green
      </MenuItem>
      <MenuItem 
        onClick={() => { 
          setColorPalette('greenMonochromatic'); 
          setSettingsAnchor(null);
          setSettingsDialogOpen(false);
        }}
      >
        Monochrome Green
      </MenuItem>
      <Divider />

      <MenuItem onClick={() => { 
        setShowGrid(!showGrid); 
        setSettingsAnchor(null);
        setSettingsDialogOpen(false);
      }}>
        <Switch checked={showGrid} size="small" />
        Show Grid
      </MenuItem>
      <MenuItem onClick={() => { 
        setShowLegend(!showLegend); 
        setSettingsAnchor(null);
        setSettingsDialogOpen(false);
      }}>
        <Switch checked={showLegend} size="small" />
        Show Legend
      </MenuItem>
      {onRefresh && (
        <MenuItem onClick={() => { 
          setIsLive(!isLive); 
          setSettingsAnchor(null);
          setSettingsDialogOpen(false);
        }}>
          <Switch checked={isLive} size="small" />
          Live Updates
        </MenuItem>
      )}
      <Divider />

      <MenuItem disabled>Export As</MenuItem>
      <MenuItem onClick={() => { 
        handleExport('png'); 
        setSettingsAnchor(null);
        setSettingsDialogOpen(false);
      }}>
        PNG Image
      </MenuItem>
      <MenuItem onClick={() => { 
        handleExport('pdf'); 
        setSettingsAnchor(null);
        setSettingsDialogOpen(false);
      }}>
        PDF Document
      </MenuItem>
      <Divider />

      {!isTemplate && onRemove && (
        <MenuItem 
          onClick={() => { 
            onRemove(); 
            setSettingsAnchor(null);
            setSettingsDialogOpen(false);
          }} 
          sx={{ color: 'error.main' }}
        >
          Remove Widget
        </MenuItem>
      )}
    </>
  );

  const filterContent = (
    <div className="p-4 w-full">
      <h4 className="font-medium mb-4 text-gray-800">Filter Data</h4>
      {data && data.length > 0 && Object.keys(data[0])
        .filter(key => !['name', 'label', 'x', 'y', 'r'].includes(key))
        .map(key => (
          <div key={key} className="mb-3">
            <FormControl fullWidth size="small">
              <InputLabel>{key}</InputLabel>
              <Select
                value={filters[key] || ''}
                onChange={(e) => handleFilterChange(key, e.target.value)}
                label={key}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {[...new Set(data.map(item => item[key]))].map(value => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        ))}
      <div className="flex justify-end mt-4 gap-2">
        <Button 
          variant="outlined" 
          size="small" 
          onClick={resetFilters}
        >
          Reset
        </Button>
        <Button 
          variant="contained" 
          size="small" 
          onClick={() => {
            setFilterAnchor(null);
            setFilterDialogOpen(false);
          }}
          sx={{ backgroundColor: '#30B349', '&:hover': { backgroundColor: '#2a9e40' } }}
        >
          Apply
        </Button>
      </div>
    </div>
  );

  return (
    <div 
      ref={containerRef}
      className={`bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl ${
        isFullscreen ? 'fixed inset-0 z-50 m-4' : 'relative w-full h-full'
      }`}
    >
      <div className="flex justify-between items-center bg-gradient-to-r from-gray-50 to-white p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800 text-lg truncate max-w-[60%]">
          {title || 'Untitled Chart'}
        </h3>
        <div className="flex space-x-2">
          {onRefresh && (
            <IconButton 
              size="small" 
              onClick={onRefresh}
              title="Refresh Data"
              className="hover:bg-green-50 text-gray-600 hover:text-green-600"
            >
              <FiRefreshCw size={isMobile ? 16 : 18} className={isLive ? 'animate-spin' : ''} />
            </IconButton>
          )}
          
          <IconButton 
            size="small" 
            onClick={() => {
              if (isMobile) {
                setFilterDialogOpen(true);
              } else {
                setFilterAnchor(containerRef.current);
              }
            }}
            title="Filter Data"
            className="hover:bg-green-50 text-gray-600 hover:text-green-600"
          >
            <FiFilter size={isMobile ? 16 : 18} />
          </IconButton>
          
          <IconButton 
            size="small" 
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Minimize' : 'Maximize'}
            className="hover:bg-green-50 text-gray-600 hover:text-green-600"
          >
            {isFullscreen ? 
              <FiMinimize size={isMobile ? 16 : 18} /> : 
              <FiMaximize size={isMobile ? 16 : 18} />
            }
          </IconButton>
          
          <IconButton 
            size="small" 
            onClick={() => {
              if (isMobile) {
                setSettingsDialogOpen(true);
              } else {
                setIsEditing(true);
                setSettingsAnchor(containerRef.current);
              }
            }}
            title="Settings"
            className="hover:bg-green-50 text-gray-600 hover:text-green-600"
          >
            <FiSettings size={isMobile ? 16 : 18} />
          </IconButton>
          
          {!isMobile && (
            <>
              <Menu
                anchorEl={settingsAnchor}
                open={Boolean(settingsAnchor)}
                onClose={() => {
                  setIsEditing(false);
                  setSettingsAnchor(null);
                }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{ 
                  sx: { 
                    borderRadius: 2,
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                  } 
                }}
              >
                {settingsMenu}
              </Menu>
              
              <Menu
                anchorEl={filterAnchor}
                open={Boolean(filterAnchor)}
                onClose={() => setFilterAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{ 
                  style: { 
                    width: isTablet ? '90vw' : '300px',
                    borderRadius: 12
                  } 
                }}
              >
                {filterContent}
              </Menu>
            </>
          )}
        </div>
      </div>
      
      <div className="p-4 w-full h-[calc(100%-72px)] relative">
        {filteredData && filteredData.length > 0 ? (
          <canvas 
            ref={chartRef} 
            width="100%" 
            height="100%"
            className="rounded-lg"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-3">
              <FiFilter className="text-green-400 text-xl" />
            </div>
            <p className="text-gray-500">No data available</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>
      
      {isEditing && !isFullscreen && !isMobile && (
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <Button 
            variant="outlined" 
            size="small"
            onClick={() => {
              if (onUpdate) onUpdate({ width: '100%' });
            }}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              borderColor: '#30B349',
              color: '#30B349',
              '&:hover': {
                borderColor: '#2a9e40',
                backgroundColor: 'rgba(48, 179, 73, 0.04)'
              }
            }}
          >
            Fit Width
          </Button>
        </div>
      )}
      
      {/* Mobile Dialogs */}
      <Dialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        fullScreen={isMobile}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: isMobile ? 0 : 2 } }}
      >
        <DialogTitle className="bg-gradient-to-r from-gray-50 to-white">
          Filter Data
        </DialogTitle>
        <DialogContent>
          {filterContent}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFilterDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      
      <Dialog
        open={settingsDialogOpen}
        onClose={() => setSettingsDialogOpen(false)}
        fullScreen={isMobile}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: isMobile ? 0 : 2 } }}
      >
        <DialogTitle className="bg-gradient-to-r from-gray-50 to-white">
          Chart Settings
        </DialogTitle>
        <DialogContent>
          <div className="py-2">
            {settingsMenu}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ChartWidget;