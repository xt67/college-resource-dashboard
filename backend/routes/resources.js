const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  getResourceTypes,
  getResourceLocations,
  updateResourceAvailability
} = require('../controllers/resourceController');

const { authenticateToken, requireRole } = require('../middleware/auth');
const {
  validateResourceCreation,
  validateResourceUpdate,
  validateResourceId,
  validateAvailabilityUpdate
} = require('../middleware/validation');

// Handle validation errors middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Public routes (read-only access)
// GET /api/resources - Get all resources with optional filters
router.get('/', getResources);

// GET /api/resources/types - Get all resource types
router.get('/types', getResourceTypes);

// GET /api/resources/locations - Get all resource locations
router.get('/locations', getResourceLocations);

// GET /api/resources/:id - Get a single resource
router.get('/:id', validateResourceId, handleValidationErrors, getResourceById);

// Protected routes - require authentication
// POST /api/resources - Create a new resource (admin/staff only)
router.post('/',
  authenticateToken,
  requireRole(['admin', 'staff']),
  validateResourceCreation,
  handleValidationErrors,
  createResource
);

// PUT /api/resources/:id - Update a resource (admin/staff only)
router.put('/:id',
  authenticateToken,
  requireRole(['admin', 'staff']),
  validateResourceUpdate,
  handleValidationErrors,
  updateResource
);

// DELETE /api/resources/:id - Delete a resource (admin only)
router.delete('/:id',
  authenticateToken,
  requireRole(['admin']),
  validateResourceId,
  handleValidationErrors,
  deleteResource
);

// PATCH /api/resources/:id/availability - Update resource availability (for booking system)
router.patch('/:id/availability',
  authenticateToken,
  validateAvailabilityUpdate,
  handleValidationErrors,
  updateResourceAvailability
);

module.exports = router;