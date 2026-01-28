// // src/components/Dashboard/CustomDashboard.jsx
// import React, { useState, useEffect } from 'react';
// import {
//   DndContext, 
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   DragOverlay
// } from '@dnd-kit/core';
// import {
//   arrayMove,
//   SortableContext,
//   sortableKeyboardCoordinates,
//   rectSortingStrategy,
// } from '@dnd-kit/sortable';
// import { restrictToWindowEdges } from '@dnd-kit/modifiers';
// import { SortableItem } from './SortableItem';
// import ChartWidget from './ChartWidget';
// import AddCircleIcon from '@mui/icons-material/AddCircle';
// import ShareIcon     from '@mui/icons-material/Share';
// import ViewModuleIcon from '@mui/icons-material/ViewModule';
// import SaveIcon      from '@mui/icons-material/Save';
// import GroupIcon     from '@mui/icons-material/Group';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Grid,
//   Box,
//   Typography,
//   TextField,
//   Tabs,
//   Tab,
//   useMediaQuery,
//   useTheme
// } from '@mui/material';

// // Sample data and templates
// const sampleData = {
//   storyStats: [
//     { name: 'Jan', stories: 12, views: 4000, engagement: 45 },
//     { name: 'Feb', stories: 19, views: 3000, engagement: 38 },
//     { name: 'Mar', stories: 15, views: 5000, engagement: 52 },
//     { name: 'Apr', stories: 8, views: 2000, engagement: 28 },
//     { name: 'May', stories: 11, views: 3500, engagement: 42 },
//   ],
//   userActivity: [
//     { name: 'Mon', logins: 20, searches: 45, shares: 12 },
//     { name: 'Tue', logins: 15, searches: 32, shares: 8 },
//     { name: 'Wed', logins: 25, searches: 50, shares: 18 },
//     { name: 'Thu', logins: 18, searches: 38, shares: 10 },
//     { name: 'Fri', logins: 22, searches: 42, shares: 15 },
//   ],
//   contentTypes: [
//     { name: 'Articles', value: 35, authors: 12 },
//     { name: 'Videos', value: 20, authors: 8 },
//     { name: 'Infographics', value: 15, authors: 5 },
//     { name: 'Podcasts', value: 10, authors: 4 },
//     { name: 'Other', value: 20, authors: 7 },
//   ],
//   performance: [
//     { x: 10, y: 20, r: 5 },
//     { x: 15, y: 25, r: 8 },
//     { x: 20, y: 15, r: 6 },
//     { x: 25, y: 30, r: 10 },
//     { x: 30, y: 22, r: 7 }
//   ]
// };

// const widgetTemplates = [
//   { 
//     id: 'storyStats', 
//     name: 'Story Statistics', 
//     description: 'Track story performance over time',
//     initialData: sampleData.storyStats,
//     defaultChartType: 'bar',
//     width: 500,
//     height: 350
//   },
//   { 
//     id: 'userActivity', 
//     name: 'User Activity', 
//     description: 'Monitor user engagement metrics',
//     initialData: sampleData.userActivity,
//     defaultChartType: 'line',
//     width: 500,
//     height: 350
//   },
//   { 
//     id: 'contentTypes', 
//     name: 'Content Types', 
//     description: 'Breakdown of content distribution',
//     initialData: sampleData.contentTypes,
//     defaultChartType: 'pie',
//     width: 400,
//     height: 400
//   },
//   { 
//     id: 'performance', 
//     name: 'Performance Metrics', 
//     description: 'Correlation between metrics',
//     initialData: sampleData.performance,
//     defaultChartType: 'scatter',
//     width: 500,
//     height: 400
//   }
// ];

// const CustomDashboard = () => {
//   const [widgets, setWidgets] = useState([]);
//   const [activeId, setActiveId] = useState(null);
//   const [isAddModalVisible, setIsAddModalVisible] = useState(false);
//   const [selectedTemplate, setSelectedTemplate] = useState(null);
//   const [activeTab, setActiveTab] = useState('templates');
//   const [isSharing, setIsSharing] = useState(false);
//   const [dashboardName, setDashboardName] = useState('My Dashboard');
  
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
//   const sensors = useSensors(
//     useSensor(PointerSensor),
//     useSensor(KeyboardSensor, {
//       coordinateGetter: sortableKeyboardCoordinates,
//     })
//   );

//   // Load saved layout
//   useEffect(() => {
//     const savedLayout = localStorage.getItem('dashboardLayout');
//     if (savedLayout) {
//       try {
//         const parsed = JSON.parse(savedLayout);
//         setWidgets(parsed.widgets || []);
//         setDashboardName(parsed.name || 'My Dashboard');
//       } catch (e) {
//         console.error('Failed to load saved layout', e);
//       }
//     }
//   }, []);

//   // Save layout to localStorage
//   const saveLayout = (newWidgets) => {
//     const layout = {
//       name: dashboardName,
//       widgets: newWidgets,
//       createdAt: new Date().toISOString()
//     };
//     localStorage.setItem('dashboardLayout', JSON.stringify(layout));
//   };

//   // Handle drag events
//   const handleDragStart = (event) => {
//     setActiveId(event.active.id);
//   };

//   const handleDragEnd = (event) => {
//     const { active, over } = event;
    
//     if (active.id !== over.id) {
//       setWidgets((items) => {
//         const oldIndex = items.findIndex(item => item.id === active.id);
//         const newIndex = items.findIndex(item => item.id === over.id);
//         const newItems = arrayMove(items, oldIndex, newIndex);
//         saveLayout(newItems);
//         return newItems;
//       });
//     }
    
//     setActiveId(null);
//   };

//   // Add a new widget from template
//   const handleAddWidget = () => {
//     if (!selectedTemplate) return;
    
//     const template = widgetTemplates.find(w => w.id === selectedTemplate);
//     if (!template) return;
    
//     const newWidget = {
//       id: `widget-${Date.now()}`,
//       type: template.id,
//       title: template.name,
//       chartType: template.defaultChartType,
//       data: template.initialData,
//       width: template.width,
//       height: template.height
//     };
    
//     const newWidgets = [...widgets, newWidget];
//     setWidgets(newWidgets);
//     saveLayout(newWidgets);
//     setIsAddModalVisible(false);
//     setSelectedTemplate(null);
//   };

//   // Remove a widget
//   const handleRemoveWidget = (id) => {
//     const newWidgets = widgets.filter(w => w.id !== id);
//     setWidgets(newWidgets);
//     saveLayout(newWidgets);
//   };

//   // Update widget properties
//   const handleUpdateWidget = (id, updates) => {
//     const newWidgets = widgets.map(w => 
//       w.id === id ? { ...w, ...updates } : w
//     );
//     setWidgets(newWidgets);
//     saveLayout(newWidgets);
//   };

//   // Refresh widget data
//   const handleRefreshWidget = (id) => {
//     // In a real app, this would fetch fresh data from the API
//     console.log(`Refreshing widget ${id}`);
//     // For demo, we'll just rotate the data
//     const widget = widgets.find(w => w.id === id);
//     if (widget) {
//       const newData = [...widget.data].reverse();
//       handleUpdateWidget(id, { data: newData });
//     }
//   };

//   // Get the currently dragged widget for overlay
//   const getActiveWidget = () => {
//     return widgets.find(w => w.id === activeId);
//   };

//   // Share dashboard layout
//   const handleShareDashboard = () => {
//     // In a real app, this would save to a shared location or generate a shareable link
//     console.log('Sharing dashboard:', { name: dashboardName, widgets });
//     setIsSharing(false);
//     // Show success message
//   };

//   return (
//     <div className="p-2 sm:p-3 md:p-4">
//       <Box sx={{ 
//         display: 'flex', 
//         flexDirection: isMobile ? 'column' : 'row',
//         justifyContent: 'space-between', 
//         alignItems: isMobile ? 'flex-start' : 'center', 
//         mb: 3,
//         gap: isMobile ? 2 : 0
//       }}>
//         <Typography variant={isMobile ? "h6" : "h5"} component="h2">
//           {dashboardName}
//         </Typography>
//         <Box sx={{ 
//           display: 'flex', 
//           gap: 1,
//           flexWrap: 'wrap',
//           width: isMobile ? '100%' : 'auto'
//         }}>
//           <Button
//             variant="contained"
//             size={isMobile ? "small" : "medium"}
//             startIcon={<SaveIcon />}
//             onClick={() => saveLayout(widgets)}
//             sx={{ flex: isMobile ? 1 : 'auto' }}
//           >
//             {isMobile ? 'Save' : 'Save'}
//           </Button>
//           <Button
//             variant="outlined"
//             size={isMobile ? "small" : "medium"}
//             startIcon={<ShareIcon />}
//             onClick={() => setIsSharing(true)}
//             sx={{ flex: isMobile ? 1 : 'auto' }}
//           >
//             {isMobile ? 'Share' : 'Share'}
//           </Button>
//           <Button
//             variant="contained"
//             size={isMobile ? "small" : "medium"}
//             startIcon={<AddCircleIcon />}
//             onClick={() => setIsAddModalVisible(true)}
//             sx={{ 
//               ml: isMobile ? 0 : 1,
//               flex: isMobile ? '1 0 100%' : 'auto',
//               mt: isMobile ? 1 : 0
//             }}
//           >
//             {isMobile ? 'Add Widget' : 'Add Widget'}
//           </Button>
//         </Box>
//       </Box>

//       <DndContext
//         sensors={sensors}
//         collisionDetection={closestCenter}
//         onDragStart={handleDragStart}
//         onDragEnd={handleDragEnd}
//         modifiers={[restrictToWindowEdges]}
//       >
//         <SortableContext 
//           items={widgets}
//           strategy={rectSortingStrategy}
//         >
//           <Grid container spacing={isMobile ? 2 : 3}>
//             {widgets.map(widget => (
//               <Grid item key={widget.id} xs={12} sm={6} md={4} lg={3}>
//                 <SortableItem id={widget.id}>
//                   <ChartWidget
//                     data={widget.data}
//                     title={widget.title}
//                     initialChartType={widget.chartType}
//                     initialWidth={isMobile ? 300 : widget.width}
//                     initialHeight={isMobile ? 250 : widget.height}
//                     onRemove={() => handleRemoveWidget(widget.id)}
//                     onUpdate={(updates) => handleUpdateWidget(widget.id, updates)}
//                     onRefresh={() => handleRefreshWidget(widget.id)}
//                     isMobile={isMobile}
//                   />
//                 </SortableItem>
//               </Grid>
//             ))}
//           </Grid>
//         </SortableContext>
        
//         <DragOverlay>
//           {activeId ? (
//             <Box sx={{ 
//               width: isMobile ? '300px' : '500px', 
//               opacity: 0.8 
//             }}>
//               <ChartWidget 
//                 data={getActiveWidget()?.data || []}
//                 title={getActiveWidget()?.title || ''}
//                 initialChartType={getActiveWidget()?.chartType || 'bar'}
//                 initialWidth={isMobile ? 300 : (getActiveWidget()?.width || 400)}
//                 initialHeight={isMobile ? 250 : (getActiveWidget()?.height || 300)}
//               />
//             </Box>
//           ) : null}
//         </DragOverlay>
//       </DndContext>

//       {widgets.length === 0 && (
//         <Box sx={{ 
//           display: 'flex', 
//           flexDirection: 'column', 
//           alignItems: 'center', 
//           justifyContent: 'center', 
//           height: isMobile ? '200px' : '300px',
//           border: '2px dashed #ccc',
//           borderRadius: 2,
//           p: isMobile ? 2 : 4,
//           textAlign: 'center'
//         }}>
//           <Typography variant={isMobile ? "body1" : "h6"} gutterBottom>
//             Your dashboard is empty
//           </Typography>
//           <Typography variant={isMobile ? "body2" : "body1"} color="text.secondary" gutterBottom>
//             Add widgets to start visualizing your data
//           </Typography>
//           <Button
//             variant="contained"
//             size={isMobile ? "small" : "medium"}
//             startIcon={<AddCircleIcon />}
//             onClick={() => setIsAddModalVisible(true)}
//             sx={{ mt: 2 }}
//           >
//             Add Your First Widget
//           </Button>
//         </Box>
//       )}

//       {/* Add Widget Dialog */}
//       <Dialog
//         open={isAddModalVisible}
//         onClose={() => setIsAddModalVisible(false)}
//         fullWidth
//         maxWidth={isMobile ? "xs" : "md"}
//         fullScreen={isMobile}
//       >
//         <DialogTitle sx={{ 
//           fontSize: isMobile ? '1.25rem' : '1.5rem',
//           p: isMobile ? 2 : 3
//         }}>
//           Add New Widget
//         </DialogTitle>
//         <DialogContent dividers sx={{ p: isMobile ? 2 : 3 }}>
//           <Tabs
//             value={activeTab}
//             onChange={(e, newValue) => setActiveTab(newValue)}
//             sx={{ mb: 2 }}
//             variant={isMobile ? "fullWidth" : "standard"}
//           >
//             <Tab 
//               label={isMobile ? "Templates" : "Templates"} 
//               value="templates" 
//               icon={isMobile ? <ViewModuleIcon /> : <ViewModuleIcon />} 
//               iconPosition="start"
//             />
//             <Tab 
//               label={isMobile ? "Community" : "Community"} 
//               value="community" 
//               icon={isMobile ? <GroupIcon /> : <GroupIcon />} 
//               iconPosition="start"
//               disabled 
//             />
//           </Tabs>
          
//           {activeTab === 'templates' && (
//             <Grid container spacing={isMobile ? 1 : 3}>
//               {widgetTemplates.map((template) => (
//                 <Grid item xs={12} sm={6} md={4} key={template.id}>
//                   <Box
//                     sx={{
//                       border: selectedTemplate === template.id ? '2px solid #1976d2' : '1px solid #ddd',
//                       borderRadius: 1,
//                       p: isMobile ? 1 : 2,
//                       cursor: 'pointer',
//                       '&:hover': {
//                         borderColor: '#1976d2'
//                       }
//                     }}
//                     onClick={() => setSelectedTemplate(template.id)}
//                   >
//                     <ChartWidget
//                       data={template.initialData}
//                       title={template.name}
//                       initialChartType={template.defaultChartType}
//                       initialWidth={isMobile ? 250 : 300}
//                       initialHeight={isMobile ? 200 : 250}
//                       isTemplate={true}
//                       isMobile={isMobile}
//                     />
//                     <Typography variant="subtitle2" sx={{ mt: 1, fontSize: isMobile ? '0.875rem' : '1rem' }}>
//                       {template.name}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
//                       {template.description}
//                     </Typography>
//                   </Box>
//                 </Grid>
//               ))}
//             </Grid>
//           )}
//         </DialogContent>
//         <DialogActions sx={{ p: isMobile ? 2 : 3 }}>
//           <Button 
//             onClick={() => setIsAddModalVisible(false)}
//             size={isMobile ? "small" : "medium"}
//           >
//             Cancel
//           </Button>
//           <Button
//             variant="contained"
//             disabled={!selectedTemplate}
//             onClick={handleAddWidget}
//             size={isMobile ? "small" : "medium"}
//           >
//             Add Widget
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Share Dashboard Dialog */}
//       <Dialog
//         open={isSharing}
//         onClose={() => setIsSharing(false)}
//         fullWidth
//         maxWidth={isMobile ? "xs" : "sm"}
//         fullScreen={isMobile}
//       >
//         <DialogTitle sx={{ 
//           fontSize: isMobile ? '1.25rem' : '1.5rem',
//           p: isMobile ? 2 : 3
//         }}>
//           Share Dashboard
//         </DialogTitle>
//         <DialogContent dividers sx={{ p: isMobile ? 2 : 3 }}>
//           <FormControl fullWidth sx={{ mb: 2 }}>
//             <InputLabel>Dashboard Name</InputLabel>
//             <TextField
//               value={dashboardName}
//               onChange={(e) => setDashboardName(e.target.value)}
//               label="Dashboard Name"
//               fullWidth
//               size={isMobile ? "small" : "medium"}
//             />
//           </FormControl>
//           <Typography variant="body1" sx={{ mb: 2, fontSize: isMobile ? '0.875rem' : '1rem' }}>
//             Share this dashboard with your team members or generate a shareable link.
//           </Typography>
//           <FormControl fullWidth sx={{ mb: 2 }}>
//             <InputLabel>Share With</InputLabel>
//             <Select
//               multiple
//               value={[]}
//               onChange={() => {}}
//               label="Share With"
//               size={isMobile ? "small" : "medium"}
//             >
//               <MenuItem value="team1">Team 1</MenuItem>
//               <MenuItem value="team2">Team 2</MenuItem>
//               <MenuItem value="team3">Team 3</MenuItem>
//             </Select>
//           </FormControl>
//           <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
//             Or copy this shareable link:
//           </Typography>
//           <Box sx={{ 
//             display: 'flex', 
//             flexDirection: isMobile ? 'column' : 'row',
//             alignItems: isMobile ? 'stretch' : 'center', 
//             mt: 1,
//             p: 1,
//             backgroundColor: '#f5f5f5',
//             borderRadius: 1,
//             gap: isMobile ? 1 : 0
//           }}>
//             <Typography variant="body2" sx={{ 
//               flexGrow: 1, 
//               fontSize: isMobile ? '0.75rem' : '0.875rem',
//               wordBreak: 'break-all'
//             }}>
//               https://example.com/share/abc123
//             </Typography>
//             <Button size={isMobile ? "small" : "medium"}>Copy</Button>
//           </Box>
//         </DialogContent>
//         <DialogActions sx={{ p: isMobile ? 2 : 3 }}>
//           <Button 
//             onClick={() => setIsSharing(false)}
//             size={isMobile ? "small" : "medium"}
//           >
//             Cancel
//           </Button>
//           <Button
//             variant="contained"
//             onClick={handleShareDashboard}
//             size={isMobile ? "small" : "medium"}
//           >
//             Share
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default CustomDashboard;