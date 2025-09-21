import React from 'react';
import {
  Typography,
  Grid,
  Paper,
  Box,
  Card,
  CardContent,
  LinearProgress
} from '@mui/material';
import {
  TrendingUp,
  People,
  LocationOn,
  EventAvailable
} from '@mui/icons-material';

const Dashboard = () => {
  // Mock data - replace with real API calls
  const stats = [
    {
      title: 'Total Resources',
      value: '24',
      icon: <LocationOn sx={{ fontSize: 40, color: '#1976d2' }} />,
      change: '+2 this month'
    },
    {
      title: 'Active Bookings',
      value: '156',
      icon: <EventAvailable sx={{ fontSize: 40, color: '#388e3c' }} />,
      change: '+12% from last week'
    },
    {
      title: 'Total Users',
      value: '1,247',
      icon: <People sx={{ fontSize: 40, color: '#f57c00' }} />,
      change: '+5.2% this semester'
    },
    {
      title: 'Usage Rate',
      value: '73%',
      icon: <TrendingUp sx={{ fontSize: 40, color: '#7b1fa2' }} />,
      change: 'Average this week'
    }
  ];

  const popularResources = [
    { name: 'Main Library Reading Room', usage: 89, available: 61 },
    { name: 'Computer Lab 1', usage: 76, available: 24 },
    { name: 'Basketball Court', usage: 45, available: 20 },
    { name: 'Conference Room A', usage: 67, available: 8 },
    { name: 'Study Hall B', usage: 34, available: 66 }
  ];

  const recentActivity = [
    { time: '10:30 AM', activity: 'Computer Lab 1 booked by John Doe', type: 'booking' },
    { time: '10:15 AM', activity: 'Sarah Smith checked into Main Library', type: 'checkin' },
    { time: '09:45 AM', activity: 'Basketball Court reservation cancelled', type: 'cancellation' },
    { time: '09:30 AM', activity: 'New user registered: Mike Johnson', type: 'registration' },
    { time: '09:15 AM', activity: 'Conference Room A meeting ended', type: 'checkout' }
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="h6">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" component="div">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {stat.change}
                    </Typography>
                  </Box>
                  <Box>
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Popular Resources */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Resource Usage Today
            </Typography>
            {popularResources.map((resource, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="body2">{resource.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {resource.usage}% ({resource.available} available)
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={resource.usage} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Box>
              {recentActivity.map((activity, index) => (
                <Box key={index} sx={{ mb: 2, pb: 2, borderBottom: index < recentActivity.length - 1 ? '1px solid #eee' : 'none' }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box flex={1}>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        {activity.activity}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {activity.time}
                      </Typography>
                    </Box>
                    <Box 
                      sx={{ 
                        px: 1, 
                        py: 0.5, 
                        borderRadius: 1, 
                        bgcolor: activity.type === 'booking' ? '#e3f2fd' : 
                                activity.type === 'checkin' ? '#e8f5e8' : 
                                activity.type === 'cancellation' ? '#ffebee' : '#f3e5f5',
                        color: activity.type === 'booking' ? '#1976d2' : 
                               activity.type === 'checkin' ? '#388e3c' : 
                               activity.type === 'cancellation' ? '#d32f2f' : '#7b1fa2'
                      }}
                    >
                      <Typography variant="caption" fontWeight="medium">
                        {activity.type}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;