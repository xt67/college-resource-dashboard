import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isLoading, error, clearError } = useAuth();
  
  const [activeTab, setActiveTab] = useState(0); // 0 = Login, 1 = Register
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'student',
    studentId: '',
    employeeId: '',
    department: '',
    phone: ''
  });

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    clearError();
  }, [activeTab, clearError]);

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    const result = await login(loginData);
    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      // Handle password mismatch locally
      return;
    }
    
    const { confirmPassword, ...dataToSubmit } = registerData;
    const result = await register(dataToSubmit);
    
    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    clearError();
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            College Resource Dashboard
          </Typography>
          
          <Tabs value={activeTab} onChange={handleTabChange} centered sx={{ mb: 3 }}>
            <Tab label="Sign In" />
            <Tab label="Register" />
          </Tabs>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {activeTab === 0 ? (
            // Login Form
            <Box component="form" onSubmit={handleLoginSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={loginData.email}
                onChange={handleLoginChange}
                disabled={isLoading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={loginData.password}
                onChange={handleLoginChange}
                disabled={isLoading}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Box>
          ) : (
            // Register Form
            <Box component="form" onSubmit={handleRegisterSubmit}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="firstName"
                  label="First Name"
                  value={registerData.firstName}
                  onChange={handleRegisterChange}
                  disabled={isLoading}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="lastName"
                  label="Last Name"
                  value={registerData.lastName}
                  onChange={handleRegisterChange}
                  disabled={isLoading}
                />
              </Box>
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="email"
                label="Email Address"
                type="email"
                value={registerData.email}
                onChange={handleRegisterChange}
                disabled={isLoading}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                value={registerData.password}
                onChange={handleRegisterChange}
                disabled={isLoading}
                helperText="At least 8 characters with uppercase, lowercase, and number"
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                value={registerData.confirmPassword}
                onChange={handleRegisterChange}
                disabled={isLoading}
                error={registerData.password !== registerData.confirmPassword && registerData.confirmPassword !== ''}
                helperText={registerData.password !== registerData.confirmPassword && registerData.confirmPassword !== '' ? 'Passwords do not match' : ''}
              />
              
              <FormControl fullWidth margin="normal">
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={registerData.role}
                  label="Role"
                  onChange={handleRegisterChange}
                  disabled={isLoading}
                >
                  <MenuItem value="student">Student</MenuItem>
                  <MenuItem value="faculty">Faculty</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
              
              {registerData.role === 'student' && (
                <TextField
                  margin="normal"
                  fullWidth
                  name="studentId"
                  label="Student ID"
                  value={registerData.studentId}
                  onChange={handleRegisterChange}
                  disabled={isLoading}
                />
              )}
              
              {(registerData.role === 'faculty' || registerData.role === 'admin') && (
                <TextField
                  margin="normal"
                  fullWidth
                  name="employeeId"
                  label="Employee ID"
                  value={registerData.employeeId}
                  onChange={handleRegisterChange}
                  disabled={isLoading}
                />
              )}
              
              <TextField
                margin="normal"
                fullWidth
                name="department"
                label="Department"
                value={registerData.department}
                onChange={handleRegisterChange}
                disabled={isLoading}
              />
              
              <TextField
                margin="normal"
                fullWidth
                name="phone"
                label="Phone Number"
                value={registerData.phone}
                onChange={handleRegisterChange}
                disabled={isLoading}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isLoading || registerData.password !== registerData.confirmPassword}
              >
                {isLoading ? 'Creating Account...' : 'Register'}
              </Button>
            </Box>
          )}
          
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="caption" display="block" gutterBottom>
              Demo Admin Credentials:
            </Typography>
            <Typography variant="caption" display="block">
              Email: admin@college.edu | Password: admin123
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;