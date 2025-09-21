const { body, param } = require('express-validator');

// Registration validation
const validateRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),
  
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),
  
  body('role')
    .isIn(['student', 'faculty', 'admin'])
    .withMessage('Role must be student, faculty, or admin'),
  
  body('studentId')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Student ID must be between 1 and 50 characters'),
  
  body('employeeId')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Employee ID must be between 1 and 50 characters'),
  
  body('department')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Department name cannot exceed 100 characters'),
  
  body('phone')
    .optional()
    .trim()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number')
];

// Login validation
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Profile update validation
const validateProfileUpdate = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),
  
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),
  
  body('department')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Department name cannot exceed 100 characters'),
  
  body('phone')
    .optional()
    .trim()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number')
];

// Change password validation
const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    })
];

// Resource validation rules
const validateResourceCreation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Resource name must be between 2 and 255 characters'),
  body('type')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Resource type must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Location must not exceed 255 characters'),
  body('capacity')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Capacity must be a number between 1 and 1000'),
  body('available_count')
    .optional()
    .isInt({ min: 0, max: 1000 })
    .withMessage('Available count must be a number between 0 and 1000')
];

const validateResourceUpdate = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Resource ID must be a positive integer'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Resource name must be between 2 and 255 characters'),
  body('type')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Resource type must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Location must not exceed 255 characters'),
  body('capacity')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Capacity must be a number between 1 and 1000'),
  body('available_count')
    .optional()
    .isInt({ min: 0, max: 1000 })
    .withMessage('Available count must be a number between 0 and 1000'),
  body('status')
    .optional()
    .isIn(['available', 'maintenance', 'unavailable'])
    .withMessage('Status must be available, maintenance, or unavailable')
];

const validateResourceId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Resource ID must be a positive integer')
];

const validateAvailabilityUpdate = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Resource ID must be a positive integer'),
  body('change')
    .isInt({ min: -1000, max: 1000 })
    .withMessage('Change must be an integer between -1000 and 1000')
];

// Booking validation
const validateBookingCreation = [
  body('resource_id')
    .isInt({ min: 1 })
    .withMessage('Resource ID must be a positive integer'),
  body('start_time')
    .isISO8601()
    .withMessage('Start time must be a valid datetime'),
  body('end_time')
    .isISO8601()
    .withMessage('End time must be a valid datetime'),
  body('purpose')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Purpose cannot exceed 500 characters')
];

const validateBookingUpdate = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Booking ID must be a positive integer'),
  body('start_time')
    .optional()
    .isISO8601()
    .withMessage('Start time must be a valid datetime'),
  body('end_time')
    .optional()
    .isISO8601()
    .withMessage('End time must be a valid datetime'),
  body('purpose')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Purpose cannot exceed 500 characters')
];

const validateBookingStatusUpdate = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Booking ID must be a positive integer'),
  body('status')
    .isIn(['pending', 'confirmed', 'cancelled', 'completed'])
    .withMessage('Status must be pending, confirmed, cancelled, or completed')
];

const validateBookingId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Booking ID must be a positive integer')
];

// Admin validation
const validateUserUpdate = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('User ID must be a positive integer'),
  body('role')
    .optional()
    .isIn(['student', 'staff', 'admin'])
    .withMessage('Role must be student, staff, or admin'),
  body('department')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Department name cannot exceed 100 characters')
];

const validateUserId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('User ID must be a positive integer')
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateProfileUpdate,
  validatePasswordChange,
  validateResourceCreation,
  validateResourceUpdate,
  validateResourceId,
  validateAvailabilityUpdate,
  validateBookingCreation,
  validateBookingUpdate,
  validateBookingStatusUpdate,
  validateBookingId,
  validateUserUpdate,
  validateUserId
};