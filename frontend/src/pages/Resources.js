import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
  Category as CategoryIcon,
  Inventory as InventoryIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Resources = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [capacityFilter, setCapacityFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [typeFilter, setTypeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);
  
  // Filter options
  const [resourceTypes, setResourceTypes] = useState([]);
  const [resourceLocations, setResourceLocations] = useState([]);
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create'); // 'create' or 'edit'
  const [currentResource, setCurrentResource] = useState({
    name: '',
    type: '',
    description: '',
    location: '',
    capacity: 1,
    available_count: 1
  });
  
  // Fetch resources and filter options
  useEffect(() => {
    fetchResources();
    fetchResourceTypes();
    fetchResourceLocations();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeFilter, locationFilter, availableOnly]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (typeFilter) params.append('type', typeFilter);
      if (locationFilter) params.append('location', locationFilter);
      if (availableOnly) params.append('available', 'true');
      
      const response = await fetch(`http://localhost:5000/api/resources?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setResources(data.data);
      } else {
        setError('Failed to fetch resources');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const fetchResourceTypes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/resources/types');
      const data = await response.json();
      if (data.success) {
        setResourceTypes(data.data);
      }
    } catch (err) {
      console.error('Error fetching resource types:', err);
    }
  };

  const fetchResourceLocations = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/resources/locations');
      const data = await response.json();
      if (data.success) {
        setResourceLocations(data.data);
      }
    } catch (err) {
      console.error('Error fetching resource locations:', err);
    }
  };

  const handleCreateResource = () => {
    setDialogMode('create');
    setCurrentResource({
      name: '',
      type: '',
      description: '',
      location: '',
      capacity: 1,
      available_count: 1
    });
    setOpenDialog(true);
  };

  const handleEditResource = (resource) => {
    setDialogMode('edit');
    setCurrentResource(resource);
    setOpenDialog(true);
  };

  const handleDeleteResource = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/resources/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess('Resource deleted successfully');
        fetchResources();
      } else {
        setError(data.message || 'Failed to delete resource');
      }
    } catch (err) {
      setError('Error deleting resource');
    }
  };

  const handleSaveResource = async () => {
    try {
      const url = dialogMode === 'create' 
        ? 'http://localhost:5000/api/resources'
        : `http://localhost:5000/api/resources/${currentResource.id}`;
      
      const method = dialogMode === 'create' ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(currentResource)
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess(`Resource ${dialogMode === 'create' ? 'created' : 'updated'} successfully`);
        setOpenDialog(false);
        fetchResources();
        fetchResourceTypes();
        fetchResourceLocations();
      } else {
        setError(data.message || `Failed to ${dialogMode} resource`);
      }
    } catch (err) {
      setError(`Error ${dialogMode === 'create' ? 'creating' : 'updating'} resource`);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('');
    setLocationFilter('');
    setStatusFilter('');
    setCapacityFilter('');
    setSortBy('name');
    setSortOrder('asc');
  };

  // Advanced filtering and sorting logic
  const filteredResources = resources
    .filter(resource => {
      // Search term filter
      const matchesSearch = searchTerm === '' || 
        resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.location?.toLowerCase().includes(searchTerm.toLowerCase());

      // Type filter
      const matchesType = typeFilter === '' || resource.type === typeFilter;

      // Location filter
      const matchesLocation = locationFilter === '' || resource.location === locationFilter;

      // Status filter
      const matchesStatus = statusFilter === '' || (() => {
        if (statusFilter === 'available') return resource.status === 'available' && resource.available_count > 0;
        if (statusFilter === 'unavailable') return resource.status === 'unavailable' || resource.available_count === 0;
        if (statusFilter === 'maintenance') return resource.status === 'maintenance';
        return true;
      })();

      // Capacity filter
      const matchesCapacity = capacityFilter === '' || (() => {
        if (capacityFilter === 'small') return resource.capacity <= 5;
        if (capacityFilter === 'medium') return resource.capacity > 5 && resource.capacity <= 20;
        if (capacityFilter === 'large') return resource.capacity > 20;
        return true;
      })();

      return matchesSearch && matchesType && matchesLocation && matchesStatus && matchesCapacity;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'type':
          aValue = a.type.toLowerCase();
          bValue = b.type.toLowerCase();
          break;
        case 'location':
          aValue = a.location.toLowerCase();
          bValue = b.location.toLowerCase();
          break;
        case 'capacity':
          aValue = a.capacity;
          bValue = b.capacity;
          break;
        case 'availability':
          aValue = a.available_count;
          bValue = b.available_count;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const getStatusColor = (status, availableCount) => {
    if (status === 'maintenance') return 'warning';
    if (status === 'unavailable') return 'error';
    if (availableCount === 0) return 'error';
    if (availableCount <= 2) return 'warning';
    return 'success';
  };

  const getStatusText = (status, availableCount) => {
    if (status === 'maintenance') return 'Maintenance';
    if (status === 'unavailable') return 'Unavailable';
    if (availableCount === 0) return 'Fully Booked';
    return 'Available';
  };

  const canManageResources = user && (user.role === 'admin' || user.role === 'staff');

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Resource Management
          </Typography>
          {canManageResources && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateResource}
            >
              Add Resource
            </Button>
          )}
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

        {/* Advanced Filters */}
        <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
                }}
                size="small"
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  label="Type"
                >
                  <MenuItem value="">All Types</MenuItem>
                  {resourceTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Location</InputLabel>
                <Select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  label="Location"
                >
                  <MenuItem value="">All Locations</MenuItem>
                  {resourceLocations.map((location) => (
                    <MenuItem key={location} value={location}>{location}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="available">Available</MenuItem>
                  <MenuItem value="unavailable">Unavailable</MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Capacity</InputLabel>
                <Select
                  value={capacityFilter}
                  onChange={(e) => setCapacityFilter(e.target.value)}
                  label="Capacity"
                >
                  <MenuItem value="">All Sizes</MenuItem>
                  <MenuItem value="small">Small (1-5)</MenuItem>
                  <MenuItem value="medium">Medium (6-20)</MenuItem>
                  <MenuItem value="large">Large (20+)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={1}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={clearFilters}
                size="small"
              >
                Clear
              </Button>
            </Grid>
          </Grid>
          
          {/* Sort Controls */}
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Sort by:
            </Typography>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                variant="outlined"
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="type">Type</MenuItem>
                <MenuItem value="location">Location</MenuItem>
                <MenuItem value="capacity">Capacity</MenuItem>
                <MenuItem value="availability">Availability</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                variant="outlined"
              >
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="body2" color="text.secondary">
              {filteredResources.length} of {resources.length} resources
            </Typography>
          </Box>
        </Paper>

        {/* Loading */}
        {loading && (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        )}

        {/* Resource Grid */}
        {!loading && (
          <Grid container spacing={3}>
            {filteredResources.map((resource) => (
              <Grid item xs={12} sm={6} md={4} key={resource.id}>
                <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                      <Typography variant="h6" component="h3" gutterBottom>
                        {resource.name}
                      </Typography>
                      <Chip
                        label={getStatusText(resource.status, resource.available_count)}
                        color={getStatusColor(resource.status, resource.available_count)}
                        size="small"
                      />
                    </Box>
                    
                    <Box display="flex" alignItems="center" mb={1}>
                      <CategoryIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {resource.type}
                      </Typography>
                    </Box>
                    
                    {resource.location && (
                      <Box display="flex" alignItems="center" mb={1}>
                        <LocationIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {resource.location}
                        </Typography>
                      </Box>
                    )}
                    
                    <Box display="flex" alignItems="center" mb={2}>
                      <InventoryIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {resource.available_count} of {resource.capacity} available
                      </Typography>
                    </Box>
                    
                    {resource.description && (
                      <Typography variant="body2" color="text.secondary">
                        {resource.description}
                      </Typography>
                    )}
                  </CardContent>
                  
                  <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                    <Button 
                      size="small" 
                      variant="contained" 
                      color="primary"
                      onClick={() => navigate('/bookings', { state: { selectedResource: resource.id } })}
                    >
                      Book Now
                    </Button>
                    {canManageResources && (
                      <Box>
                        <Tooltip title="Edit Resource">
                          <IconButton 
                            size="small" 
                            onClick={() => handleEditResource(resource)}
                            sx={{ mr: 1 }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {user?.role === 'admin' && (
                          <Tooltip title="Delete Resource">
                            <IconButton 
                              size="small" 
                              onClick={() => handleDeleteResource(resource.id)}
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Empty State */}
        {!loading && filteredResources.length === 0 && (
          <Box textAlign="center" py={6}>
            <InventoryIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No resources found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search criteria or filters
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Create/Edit Resource Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' ? 'Add New Resource' : 'Edit Resource'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Resource Name"
                  value={currentResource.name}
                  onChange={(e) => setCurrentResource({ ...currentResource, name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Type"
                  value={currentResource.type}
                  onChange={(e) => setCurrentResource({ ...currentResource, type: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location"
                  value={currentResource.location}
                  onChange={(e) => setCurrentResource({ ...currentResource, location: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={currentResource.description}
                  onChange={(e) => setCurrentResource({ ...currentResource, description: e.target.value })}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Total Capacity"
                  type="number"
                  value={currentResource.capacity}
                  onChange={(e) => setCurrentResource({ ...currentResource, capacity: parseInt(e.target.value) || 1 })}
                  inputProps={{ min: 1 }}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Available Count"
                  type="number"
                  value={currentResource.available_count}
                  onChange={(e) => setCurrentResource({ ...currentResource, available_count: parseInt(e.target.value) || 0 })}
                  inputProps={{ min: 0, max: currentResource.capacity }}
                  required
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveResource} variant="contained">
            {dialogMode === 'create' ? 'Create' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Resources;