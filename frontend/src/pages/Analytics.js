import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Divider,
  Button
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  Event as EventIcon,
  People as PeopleIcon,
  Computer as ComputerIcon,
  Room as RoomIcon,
  DateRange as DateRangeIcon,
  FileDownload as DownloadIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Analytics = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [timeRange, setTimeRange] = useState('7d');
  const [reportType, setReportType] = useState('overview');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/admin/analytics?timeRange=${timeRange}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setAnalytics(data.data);
      } else {
        setError('Failed to fetch analytics data');
      }
    } catch (err) {
      setError('Error fetching analytics data');
    } finally {
      setLoading(false);
    }
  };

  const calculateUtilizationRate = () => {
    if (!analytics?.resourceStats) return 0;
    const { total_resources, available_resources } = analytics.resourceStats;
    return total_resources > 0 ? ((total_resources - available_resources) / total_resources * 100) : 0;
  };

  const getTopResourceTypes = () => {
    if (!analytics?.popularResources) return [];
    const typeCount = {};
    analytics.popularResources.forEach(resource => {
      typeCount[resource.type] = (typeCount[resource.type] || 0) + parseInt(resource.booking_count);
    });
    return Object.entries(typeCount)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime || dateTime === 'CURRENT_DATETIME') return 'Recently';
    return new Date(dateTime).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportReport = async () => {
    try {
      const reportData = {
        generatedAt: new Date().toISOString(),
        timeRange,
        ...analytics
      };
      
      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: 'application/json'
      });
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resource-analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to export report');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="between" mb={4}>
        <Box display="flex" alignItems="center">
          <AssessmentIcon sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h3" component="h1">
            Analytics Dashboard
          </Typography>
        </Box>
      </Box>

      {/* Controls */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Time Range</InputLabel>
              <Select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                label="Time Range"
              >
                <MenuItem value="1d">Last 24 Hours</MenuItem>
                <MenuItem value="7d">Last 7 Days</MenuItem>
                <MenuItem value="30d">Last 30 Days</MenuItem>
                <MenuItem value="90d">Last 90 Days</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Report Type</InputLabel>
              <Select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                label="Report Type"
              >
                <MenuItem value="overview">Overview</MenuItem>
                <MenuItem value="detailed">Detailed</MenuItem>
                <MenuItem value="trends">Trends</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={exportReport}
              fullWidth
            >
              Export Report
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {analytics && (
        <Grid container spacing={3}>
          {/* Key Performance Indicators */}
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <TrendingUpIcon sx={{ mr: 1 }} />
              Key Performance Indicators
            </Typography>
          </Grid>

          {/* Total Users Card */}
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Box>
                    <Typography variant="h4" color="primary.main" fontWeight="bold">
                      {analytics.userStats.total_users}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      Total Users
                    </Typography>
                  </Box>
                  <PeopleIcon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.7 }} />
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Students: {analytics.userStats.students}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Staff: {analytics.userStats.staff}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Admins: {analytics.userStats.admins}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Total Resources Card */}
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Box>
                    <Typography variant="h4" color="success.main" fontWeight="bold">
                      {analytics.resourceStats.total_resources}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      Total Resources
                    </Typography>
                  </Box>
                  <ComputerIcon sx={{ fontSize: 48, color: 'success.main', opacity: 0.7 }} />
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Available: {analytics.resourceStats.available_resources}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Capacity: {analytics.resourceStats.total_capacity}
                  </Typography>
                  <Box mt={1}>
                    <Typography variant="caption" color="text.secondary">
                      Utilization Rate
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={calculateUtilizationRate()}
                      sx={{ height: 8, borderRadius: 4 }}
                      color="success"
                    />
                    <Typography variant="caption" color="text.secondary">
                      {Math.round(calculateUtilizationRate())}%
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Total Bookings Card */}
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Box>
                    <Typography variant="h4" color="warning.main" fontWeight="bold">
                      {analytics.bookingStats.total_bookings}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      Total Bookings
                    </Typography>
                  </Box>
                  <EventIcon sx={{ fontSize: 48, color: 'warning.main', opacity: 0.7 }} />
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Pending: {analytics.bookingStats.pending_bookings}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Confirmed: {analytics.bookingStats.confirmed_bookings}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cancelled: {analytics.bookingStats.cancelled_bookings || 0}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Peak Hours Card */}
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Box>
                    <Typography variant="h4" color="info.main" fontWeight="bold">
                      9-11 AM
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      Peak Hours
                    </Typography>
                  </Box>
                  <ScheduleIcon sx={{ fontSize: 48, color: 'info.main', opacity: 0.7 }} />
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Highest booking activity during morning hours
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Secondary peak: 2-4 PM
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Resource Type Analysis */}
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <ComputerIcon sx={{ mr: 1 }} />
                  Resource Type Analysis
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Type</TableCell>
                        <TableCell align="right">Total Bookings</TableCell>
                        <TableCell align="right">Popularity</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getTopResourceTypes().map((item, index) => (
                        <TableRow key={item.type}>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              {item.type === 'Room' ? <RoomIcon sx={{ mr: 1, fontSize: 18 }} /> : <ComputerIcon sx={{ mr: 1, fontSize: 18 }} />}
                              <Typography variant="body2">{item.type}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="bold">
                              {item.count}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ width: 60 }}>
                              <LinearProgress
                                variant="determinate"
                                value={(item.count / Math.max(...getTopResourceTypes().map(r => r.count))) * 100}
                                sx={{ height: 6, borderRadius: 3 }}
                              />
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Most Popular Resources */}
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUpIcon sx={{ mr: 1 }} />
                  Most Popular Resources
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Resource</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell align="right">Bookings</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {analytics.popularResources.slice(0, 5).map((resource) => (
                        <TableRow key={resource.id}>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {resource.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {resource.location}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={resource.type}
                              size="small"
                              color={resource.type === 'Room' ? 'primary' : 'secondary'}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="bold" color="primary">
                              {resource.booking_count}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activity Timeline */}
          <Grid item xs={12}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <DateRangeIcon sx={{ mr: 1 }} />
                  Recent Activity Timeline
                </Typography>
                <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                  {analytics.recentActivity.length > 0 ? (
                    analytics.recentActivity.map((activity, index) => (
                      <Box
                        key={activity.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          py: 2,
                          borderBottom: index < analytics.recentActivity.length - 1 ? '1px solid #eee' : 'none'
                        }}
                      >
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            bgcolor: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            mr: 2
                          }}
                        >
                          {activity.user_name.charAt(0)}
                        </Box>
                        <Box flexGrow={1}>
                          <Typography variant="body1">
                            <strong>{activity.user_name}</strong> booked{' '}
                            <strong>{activity.resource_name}</strong>
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDateTime(activity.created_at)} • Status: {activity.status}
                          </Typography>
                        </Box>
                        <Chip
                          label={activity.status}
                          size="small"
                          color={activity.status === 'confirmed' ? 'success' : 'warning'}
                        />
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                      No recent activity
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Analytics; 'react';
import { Typography, Box } from '@mui/material';

const Analytics = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Analytics
      </Typography>
      <Typography variant="body1">
        Analytics page - to be implemented with charts and usage statistics.
      </Typography>
    </Box>
  );
};

export default Analytics;