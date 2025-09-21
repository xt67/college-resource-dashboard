const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateUserUpdate, validateUserId } = require('../middleware/validation');

// All admin routes require admin authentication
router.use(authenticateToken);
router.use(requireRole(['admin']));

// Analytics and dashboard
router.get('/analytics', adminController.getSystemAnalytics);
router.get('/health', adminController.getSystemHealth);
router.get('/reports', adminController.generateReport);

// User management
router.get('/users', adminController.getUsers);
router.put('/users/:id', validateUserUpdate, adminController.updateUser);
router.delete('/users/:id', validateUserId, adminController.deleteUser);

module.exports = router;