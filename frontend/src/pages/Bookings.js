import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
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
  Tab
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  Category as CategoryIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Bookings = () => {
  const { user, token } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Tab management
  const [currentTab, setCurrentTab] = useState(0);
  
  // Data states
  const [bookings, setBookings] = useState([]);
  const [resources, setResources] = useState([]);
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create'); // 'create' or 'edit'
  const [currentBooking, setCurrentBooking] = useState({
    resource_id: '',
    start_time: '',
    end_time: '',
    purpose: ''
  });

  useEffect(() => {
    fetchUserBookings();
    fetchResources();
    
    // Check if a resource was selected from the Resources page
    if (location.state?.selectedResource) {
      // Delay to ensure resources are loaded first
      setTimeout(() => {
        handleCreateBooking(location.state.selectedResource);
      }, 500);
    }
  }, []);

  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/bookings/my-bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setBookings(data.data);
      } else {
        setError('Failed to fetch bookings');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const fetchResources = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/resources');
      const data = await response.json();
      
      if (data.success) {
        setResources(data.data.filter(r => r.status === 'available'));
      }
    } catch (err) {
      console.error('Error fetching resources:', err);
    }
  };

  const handleCreateBooking = (preselectedResourceId = null) => {
    setDialogMode('create');
    setCurrentBooking({
      resource_id: preselectedResourceId || '',
      start_time: '',
      end_time: '',
      purpose: ''
    });
    setOpenDialog(true);
  };

  const handleEditBooking = (booking) => {
    setDialogMode('edit');
    
    // Format datetime for input fields
    const startTime = new Date(booking.start_time);
    const endTime = new Date(booking.end_time);
    
    setCurrentBooking({
      id: booking.id,
      resource_id: booking.resource_id,
      start_time: startTime.toISOString().slice(0, 16),
      end_time: endTime.toISOString().slice(0, 16),
      purpose: booking.purpose || ''
    });
    setOpenDialog(true);
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'cancelled' })
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess('Booking cancelled successfully');
        fetchUserBookings();
      } else {
        setError(data.message || 'Failed to cancel booking');
      }
    } catch (err) {
      setError('Error cancelling booking');
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess('Booking deleted successfully');
        fetchUserBookings();
      } else {
        setError(data.message || 'Failed to delete booking');
      }
    } catch (err) {
      setError('Error deleting booking');
    }
  };

  const handleSaveBooking = async () => {
    try {
      // Validate required fields
      if (!currentBooking.resource_id || !currentBooking.start_time || !currentBooking.end_time) {
        setError('Please fill in all required fields');
        return;
      }

      // Validate time range
      const startTime = new Date(currentBooking.start_time);
      const endTime = new Date(currentBooking.end_time);
      const now = new Date();

      if (startTime <= now) {
        setError('Start time must be in the future');
        return;
      }

      if (endTime <= startTime) {
        setError('End time must be after start time');
        return;
      }

      const url = dialogMode === 'create' 
        ? 'http://localhost:5000/api/bookings'
        : `http://localhost:5000/api/bookings/${currentBooking.id}`;
      
      const method = dialogMode === 'create' ? 'POST' : 'PUT';
      
      const bookingData = {
        resource_id: parseInt(currentBooking.resource_id),
        start_time: new Date(currentBooking.start_time).toISOString(),
        end_time: new Date(currentBooking.end_time).toISOString(),
        purpose: currentBooking.purpose
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess(`Booking ${dialogMode === 'create' ? 'created' : 'updated'} successfully`);
        setOpenDialog(false);
        fetchUserBookings();
      } else {
        setError(data.message || `Failed to ${dialogMode} booking`);
      }
    } catch (err) {
      setError(`Error ${dialogMode === 'create' ? 'creating' : 'updating'} booking`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      case 'completed': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircleIcon fontSize="small" />;
      case 'pending': return <PendingIcon fontSize="small" />;
      case 'cancelled': return <CancelIcon fontSize="small" />;
      case 'completed': return <CheckCircleIcon fontSize="small" />;
      default: return <ScheduleIcon fontSize="small" />;
    }
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isBookingEditable = (booking) => {
    const startTime = new Date(booking.start_time);
    const now = new Date();
    return booking.status === 'pending' && startTime > now;
  };

  const isBookingCancellable = (booking) => {
    const startTime = new Date(booking.start_time);
    const now = new Date();
    return (booking.status === 'pending' || booking.status === 'confirmed') && startTime > now;
  };

  // Sort bookings by start time (upcoming first)
  const sortedBookings = [...bookings].sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
  
  // Separate upcoming and past bookings
  const now = new Date();
  const upcomingBookings = sortedBookings.filter(b => new Date(b.start_time) > now);
  const pastBookings = sortedBookings.filter(b => new Date(b.start_time) <= now);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const renderBookingCard = (booking) => (
    <Card key={booking.id} elevation={2} sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="h6" gutterBottom>
              {booking.resource_name}
            </Typography>
            <Chip
              icon={getStatusIcon(booking.status)}
              label={booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              color={getStatusColor(booking.status)}
              size="small"
              sx={{ mb: 1 }}
            />
          </Box>
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" mb={1}>
              <CategoryIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {booking.resource_type}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <LocationIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {booking.resource_location}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" mb={1}>
              <EventIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {formatDateTime(booking.start_time)}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                Until {formatDateTime(booking.end_time)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        
        {booking.purpose && (
          <Box mt={2}>
            <Typography variant="body2" color="text.secondary">
              <strong>Purpose:</strong> {booking.purpose}
            </Typography>
          </Box>
        )}
      </CardContent>
      
      <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
        {isBookingEditable(booking) && (
          <Button
            size="small"
            startIcon={<EditIcon />}
            onClick={() => handleEditBooking(booking)}
          >
            Edit
          </Button>
        )}
        {isBookingCancellable(booking) && (
          <Button
            size="small"
            startIcon={<CancelIcon />}
            onClick={() => handleCancelBooking(booking.id)}
            color="warning"
          >
            Cancel
          </Button>
        )}
        {booking.status === 'cancelled' && (
          <Button
            size="small"
            startIcon={<DeleteIcon />}
            onClick={() => handleDeleteBooking(booking.id)}
            color="error"
          >
            Delete
          </Button>
        )}
      </CardActions>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            My Bookings
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateBooking}
          >
            New Booking
          </Button>
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

        {/* Loading */}
        {loading && (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        )}

        {/* Tabs */}
        {!loading && (
          <>
            <Tabs value={currentTab} onChange={handleTabChange} sx={{ mb: 3 }}>
              <Tab label={`Upcoming (${upcomingBookings.length})`} />
              <Tab label={`Past (${pastBookings.length})`} />
            </Tabs>

            {/* Upcoming Bookings */}
            {currentTab === 0 && (
              <Box>
                {upcomingBookings.length > 0 ? (
                  upcomingBookings.map(renderBookingCard)
                ) : (
                  <Box textAlign="center" py={6}>
                    <EventIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No upcoming bookings
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Create a new booking to get started
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={handleCreateBooking}
                      sx={{ mt: 2 }}
                    >
                      Create Booking
                    </Button>
                  </Box>
                )}
              </Box>
            )}

            {/* Past Bookings */}
            {currentTab === 1 && (
              <Box>
                {pastBookings.length > 0 ? (
                  pastBookings.map(renderBookingCard)
                ) : (
                  <Box textAlign="center" py={6}>
                    <ScheduleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No past bookings
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Your booking history will appear here
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </>
        )}
      </Paper>

      {/* Create/Edit Booking Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' ? 'Create New Booking' : 'Edit Booking'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Resource</InputLabel>
                  <Select
                    value={currentBooking.resource_id}
                    onChange={(e) => setCurrentBooking({ ...currentBooking, resource_id: e.target.value })}
                    label="Resource"
                  >
                    {resources.map((resource) => (
                      <MenuItem key={resource.id} value={resource.id}>
                        <Box display="flex" flexDirection="column">
                          <Typography variant="body1">{resource.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {resource.type} • {resource.location}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Start Date & Time"
                  type="datetime-local"
                  value={currentBooking.start_time}
                  onChange={(e) => setCurrentBooking({ ...currentBooking, start_time: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="End Date & Time"
                  type="datetime-local"
                  value={currentBooking.end_time}
                  onChange={(e) => setCurrentBooking({ ...currentBooking, end_time: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Purpose (Optional)"
                  value={currentBooking.purpose}
                  onChange={(e) => setCurrentBooking({ ...currentBooking, purpose: e.target.value })}
                  multiline
                  rows={3}
                  placeholder="Describe the purpose of this booking..."
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveBooking} variant="contained">
            {dialogMode === 'create' ? 'Create Booking' : 'Update Booking'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Bookings;