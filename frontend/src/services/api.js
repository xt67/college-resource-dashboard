import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

// Users API
export const usersAPI = {
  getUsers: (params) => api.get('/users', { params }),
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

// Resources API
export const resourcesAPI = {
  getResources: (params) => api.get('/resources', { params }),
  getResource: (id) => api.get(`/resources/${id}`),
  createResource: (resourceData) => api.post('/resources', resourceData),
  updateResource: (id, resourceData) => api.put(`/resources/${id}`, resourceData),
  deleteResource: (id) => api.delete(`/resources/${id}`),
  getResourceAvailability: (id, date) => api.get(`/resources/${id}/availability`, { params: { date } }),
};

// Bookings API
export const bookingsAPI = {
  getBookings: (params) => api.get('/bookings', { params }),
  getBooking: (id) => api.get(`/bookings/${id}`),
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  updateBooking: (id, bookingData) => api.put(`/bookings/${id}`, bookingData),
  deleteBooking: (id) => api.delete(`/bookings/${id}`),
  getUserBookings: (userId) => api.get(`/bookings/user/${userId}`),
};

// Analytics API
export const analyticsAPI = {
  getUsageStats: (params) => api.get('/analytics/usage', { params }),
  getResourceUsage: (resourceId, params) => api.get(`/analytics/resource/${resourceId}`, { params }),
  getPeakHours: (params) => api.get('/analytics/peak-hours', { params }),
  getUsageTrends: (params) => api.get('/analytics/trends', { params }),
  exportReport: (type, params) => api.get(`/analytics/export/${type}`, { params, responseType: 'blob' }),
};

// Admin API
export const adminAPI = {
  uploadUsageData: (formData) => api.post('/admin/upload-usage', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getSystemStats: () => api.get('/admin/stats'),
  getUserManagement: (params) => api.get('/admin/users', { params }),
  updateUserRole: (userId, role) => api.put(`/admin/users/${userId}/role`, { role }),
};

export default api;