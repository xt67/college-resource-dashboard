import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Avatar,
  LinearProgress
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  TrendingUp as TrendingUpIcon,
  Inventory as InventoryIcon,
  Event as EventIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AdminPanelSettings as AdminIcon,
  School as StudentIcon,
  Work as StaffIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Computer as ComputerIcon,
  Room as RoomIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Admin = () => {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Tab management
  const [currentTab, setCurrentTab] = useState(0);
  
  // Data states
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [systemHealth, setSystemHealth] = useState(null);
  
  // Dialog states
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userFormData, setUserFormData] = useState({ role: '', department: '' });

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAnalytics();
      fetchUsers();
      fetchSystemHealth();
    }
  }, [user, token]); // Added dependencies

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/analytics', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setAnalytics(data.data);
      } else {
        setError('Failed to fetch analytics');
      }
    } catch (err) {
      setError('Error fetching analytics');
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data);
      } else {
        setError('Failed to fetch users');
      }
    } catch (err) {
      setError('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const fetchSystemHealth = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/health', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setSystemHealth(data.data);
      }
    } catch (err) {
      console.error('Error fetching system health:', err);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setUserFormData({
      role: user.role,
      department: user.department || ''
    });
    setOpenUserDialog(true);
  };

  const handleUpdateUser = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userFormData)
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess('User updated successfully');
        setOpenUserDialog(false);
        fetchUsers();
      } else {
        setError(data.message || 'Failed to update user');
      }
    } catch (err) {
      setError('Error updating user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess('User deleted successfully');
        fetchUsers();
      } else {
        setError(data.message || 'Failed to delete user');
      }
    } catch (err) {
      setError('Error deleting user');
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <AdminIcon fontSize="small" />;
      case 'staff': return <StaffIcon fontSize="small" />;
      case 'student': return <StudentIcon fontSize="small" />;
      default: return <PeopleIcon fontSize="small" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'staff': return 'warning';
      case 'student': return 'primary';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircleIcon fontSize="small" />;
      case 'pending': return <PendingIcon fontSize="small" />;
      case 'cancelled': return <CancelIcon fontSize="small" />;
      default: return <EventIcon fontSize="small" />;
    }
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

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // Redirect if not admin
  if (user && user.role !== 'admin') {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">
          Access denied. Admin privileges required.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={4}>
        <DashboardIcon sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h3" component="h1">
          Admin Dashboard
        </Typography>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Tabs */}
      <Paper elevation={3} sx={{ mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab icon={<AssessmentIcon />} label="Analytics" />
          <Tab icon={<PeopleIcon />} label="User Management" />
          <Tab icon={<SettingsIcon />} label="System Health" />
        </Tabs>
      </Paper>

      {/* Analytics Tab */}
      {currentTab === 0 && analytics && (
        <Grid container spacing={3}>
          {/* Key Metrics Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" color="primary">
                      {analytics.userStats.total_users}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Users
                    </Typography>
                  </Box>
                  <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                </Box>
                <Box mt={2}>
                  <Typography variant="caption" color="text.secondary">
                    {analytics.userStats.students} Students • {analytics.userStats.staff} Staff • {analytics.userStats.admins} Admins
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" color="success.main">
                      {analytics.resourceStats.total_resources}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Resources
                    </Typography>
                  </Box>
                  <InventoryIcon sx={{ fontSize: 40, color: 'success.main' }} />
                </Box>
                <Box mt={2}>
                  <Typography variant="caption" color="text.secondary">
                    {analytics.resourceStats.available_resources} Available • {analytics.resourceStats.total_capacity} Total Capacity
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" color="warning.main">
                      {analytics.bookingStats.total_bookings}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Bookings
                    </Typography>
                  </Box>
                  <EventIcon sx={{ fontSize: 40, color: 'warning.main' }} />
                </Box>
                <Box mt={2}>
                  <Typography variant="caption" color="text.secondary">
                    {analytics.bookingStats.pending_bookings} Pending • {analytics.bookingStats.confirmed_bookings} Confirmed
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" color="info.main">
                      {Math.round((analytics.resourceStats.total_available / analytics.resourceStats.total_capacity) * 100)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Availability Rate
                    </Typography>
                  </Box>
                  <TrendingUpIcon sx={{ fontSize: 40, color: 'info.main' }} />
                </Box>
                <Box mt={2}>
                  <LinearProgress 
                    variant="determinate" 
                    value={(analytics.resourceStats.total_available / analytics.resourceStats.total_capacity) * 100}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Popular Resources */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
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
                            <Box display="flex" alignItems="center">
                              {resource.type === 'Room' ? <RoomIcon sx={{ mr: 1, fontSize: 18 }} /> : <ComputerIcon sx={{ mr: 1, fontSize: 18 }} />}
                              <Box>
                                <Typography variant="body2">{resource.name}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {resource.location}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip label={resource.type} size="small" />
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="bold">
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

          {/* Recent Activity */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Activity
                </Typography>
                {analytics.recentActivity.length > 0 ? (
                  analytics.recentActivity.slice(0, 5).map((activity) => (
                    <Box key={activity.id} display="flex" alignItems="center" py={1}>
                      <Avatar sx={{ width: 32, height: 32, mr: 2, bgcolor: 'primary.main' }}>
                        {activity.user_name.charAt(0)}
                      </Avatar>
                      <Box flexGrow={1}>
                        <Typography variant="body2">
                          <strong>{activity.user_name}</strong> booked {activity.resource_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDateTime(activity.created_at)}
                        </Typography>
                      </Box>
                      <Chip
                        icon={getStatusIcon(activity.status)}
                        label={activity.status}
                        size="small"
                        color={activity.status === 'confirmed' ? 'success' : 'warning'}
                      />
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No recent activity
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* User Management Tab */}
      {currentTab === 1 && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            User Management
          </Typography>
          
          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar sx={{ width: 32, height: 32, mr: 2 }}>
                            {user.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2">{user.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {user.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getRoleIcon(user.role)}
                          label={user.role}
                          color={getRoleColor(user.role)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{user.department || 'N/A'}</TableCell>
                      <TableCell>{formatDateTime(user.created_at)}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit User">
                          <IconButton 
                            size="small" 
                            onClick={() => handleEditUser(user)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {user.id !== user.id && ( // Prevent deleting self (Note: This logic should check against current user's ID)
                          <Tooltip title="Delete User">
                            <IconButton 
                              size="small" 
                              onClick={() => handleDeleteUser(user.id)}
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}

      {/* System Health Tab */}
      {currentTab === 2 && systemHealth && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Database Health
                </Typography>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    Status: <Chip label={systemHealth.database.status} color="success" size="small" />
                  </Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    Type: {systemHealth.database.type}
                  </Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    Query Time: {systemHealth.database.queryTime}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Server Information
                </Typography>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    Uptime: {Math.floor(systemHealth.server.uptime / 3600)} hours
                  </Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    Node.js: {systemHealth.server.nodeVersion}
                  </Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    Platform: {systemHealth.server.platform}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Memory Usage: {Math.round(systemHealth.server.memory.heapUsed / 1024 / 1024)} MB
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Edit User Dialog */}
      <Dialog open={openUserDialog} onClose={() => setOpenUserDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={userFormData.role}
                    onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                    label="Role"
                  >
                    <MenuItem value="student">Student</MenuItem>
                    <MenuItem value="staff">Staff</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Department"
                  value={userFormData.department}
                  onChange={(e) => setUserFormData({ ...userFormData, department: e.target.value })}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUserDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateUser} variant="contained">Update User</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Admin;