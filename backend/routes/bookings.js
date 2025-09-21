const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const {
  validateBookingCreation,
  validateBookingUpdate,
  validateBookingStatusUpdate,
  validateBookingId
} = require('../middleware/validation');

// Get all bookings (admin/staff only)
router.get('/', 
  authenticateToken, 
  requireRole(['admin', 'staff']), 
  bookingController.getBookings
);

// Get user's own bookings
router.get('/my-bookings', 
  authenticateToken, 
  bookingController.getUserBookings
);

// Get resource availability
router.get('/availability', 
  authenticateToken, 
  bookingController.getResourceAvailability
);

// Get booking by ID
router.get('/:id', 
  authenticateToken, 
  validateBookingId, 
  bookingController.getBookingById
);

// Create new booking
router.post('/', 
  authenticateToken, 
  validateBookingCreation, 
  bookingController.createBooking
);

// Update booking details
router.put('/:id', 
  authenticateToken, 
  validateBookingUpdate, 
  bookingController.updateBooking
);

// Update booking status
router.patch('/:id/status', 
  authenticateToken, 
  validateBookingStatusUpdate, 
  bookingController.updateBookingStatus
);

// Delete booking
router.delete('/:id', 
  authenticateToken, 
  validateBookingId, 
  bookingController.deleteBooking
);

module.exports = router;