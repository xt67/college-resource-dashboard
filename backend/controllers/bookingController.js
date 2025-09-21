const db = require('../config/database');
const { validationResult } = require('express-validator');

// Get all bookings with optional filtering
const getBookings = async (req, res) => {
  try {
    const { user_id, resource_id, status, start_date, end_date } = req.query;
    
    let query = `
      SELECT 
        b.id, b.user_id, b.resource_id, b.start_time, b.end_time, 
        b.status, b.purpose, b.created_at, b.updated_at,
        u.name as user_name, u.email as user_email,
        r.name as resource_name, r.type as resource_type, r.location as resource_location
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN resources r ON b.resource_id = r.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramIndex = 1;
    
    if (user_id) {
      query += ` AND b.user_id = $${paramIndex}`;
      params.push(user_id);
      paramIndex++;
    }
    
    if (resource_id) {
      query += ` AND b.resource_id = $${paramIndex}`;
      params.push(resource_id);
      paramIndex++;
    }
    
    if (status) {
      query += ` AND b.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }
    
    if (start_date) {
      query += ` AND b.start_time >= $${paramIndex}`;
      params.push(start_date);
      paramIndex++;
    }
    
    if (end_date) {
      query += ` AND b.end_time <= $${paramIndex}`;
      params.push(end_date);
      paramIndex++;
    }
    
    query += ` ORDER BY b.start_time ASC`;
    
    const result = await db.query(query, params);
    
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings'
    });
  }
};

// Get user's own bookings
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const query = `
      SELECT 
        b.id, b.resource_id, b.start_time, b.end_time, 
        b.status, b.purpose, b.created_at, b.updated_at,
        r.name as resource_name, r.type as resource_type, r.location as resource_location
      FROM bookings b
      JOIN resources r ON b.resource_id = r.id
      WHERE b.user_id = $1
      ORDER BY b.start_time DESC
    `;
    
    const result = await db.query(query, [userId]);
    
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your bookings'
    });
  }
};

// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        b.id, b.user_id, b.resource_id, b.start_time, b.end_time, 
        b.status, b.purpose, b.created_at, b.updated_at,
        u.name as user_name, u.email as user_email,
        r.name as resource_name, r.type as resource_type, r.location as resource_location
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN resources r ON b.resource_id = r.id
      WHERE b.id = $1
    `;
    
    const result = await db.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Check if user can access this booking
    const booking = result.rows[0];
    const canAccess = req.user.role === 'admin' || 
                     req.user.role === 'staff' || 
                     booking.user_id === req.user.id;
    
    if (!canAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking'
    });
  }
};

// Check for booking conflicts
const checkBookingConflicts = async (resourceId, startTime, endTime, excludeBookingId = null) => {
  let query = `
    SELECT id, start_time, end_time 
    FROM bookings 
    WHERE resource_id = $1 
    AND status IN ('confirmed', 'pending')
    AND (
      (start_time < $3 AND end_time > $2) OR
      (start_time < $2 AND end_time > $2) OR
      (start_time < $3 AND end_time > $3) OR
      (start_time >= $2 AND end_time <= $3)
    )
  `;
  
  const params = [resourceId, startTime, endTime];
  
  if (excludeBookingId) {
    query += ` AND id != $4`;
    params.push(excludeBookingId);
  }
  
  const result = await db.query(query, params);
  return result.rows;
};

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }
    
    const { resource_id, start_time, end_time, purpose } = req.body;
    const user_id = req.user.id;
    
    // Validate booking times
    const startDate = new Date(start_time);
    const endDate = new Date(end_time);
    const now = new Date();
    
    if (startDate <= now) {
      return res.status(400).json({
        success: false,
        message: 'Booking start time must be in the future'
      });
    }
    
    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: 'End time must be after start time'
      });
    }
    
    // Check if resource exists and is available
    const resourceResult = await db.query(
      'SELECT id, name, available_count, status FROM resources WHERE id = $1',
      [resource_id]
    );
    
    if (resourceResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }
    
    const resource = resourceResult.rows[0];
    
    if (resource.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'Resource is not available for booking'
      });
    }
    
    if (resource.available_count <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Resource is fully booked'
      });
    }
    
    // Check for conflicts
    const conflicts = await checkBookingConflicts(resource_id, start_time, end_time);
    
    if (conflicts.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Time slot conflicts with existing booking',
        conflicts: conflicts
      });
    }
    
    // Create the booking
    const insertQuery = `
      INSERT INTO bookings (user_id, resource_id, start_time, end_time, purpose, status)
      VALUES ($1, $2, $3, $4, $5, 'pending')
    `;
    
    const result = await db.query(insertQuery, [
      user_id, resource_id, start_time, end_time, purpose || ''
    ]);
    
    // Get the last inserted booking ID
    const lastIdQuery = db.isPostgreSQL() 
      ? 'SELECT currval(pg_get_serial_sequence(\'bookings\', \'id\')) as id'
      : 'SELECT last_insert_rowid() as id';
    
    const idResult = await db.query(lastIdQuery);
    const bookingId = db.isPostgreSQL() ? idResult.rows[0].id : idResult.rows[0].id;
    
    // Get complete booking info
    const completeBookingQuery = `
      SELECT 
        b.id, b.user_id, b.resource_id, b.start_time, b.end_time, 
        b.status, b.purpose, b.created_at, b.updated_at,
        u.name as user_name, u.email as user_email,
        r.name as resource_name, r.type as resource_type, r.location as resource_location
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN resources r ON b.resource_id = r.id
      WHERE b.id = $1
    `;
    
    const completeResult = await db.query(completeBookingQuery, [bookingId]);
    
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: completeResult.rows[0]
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking'
    });
  }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }
    
    const { id } = req.params;
    const { status } = req.body;
    
    // Check if booking exists
    const bookingResult = await db.query(
      'SELECT * FROM bookings WHERE id = $1',
      [id]
    );
    
    if (bookingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    const booking = bookingResult.rows[0];
    
    // Check permissions
    const canUpdate = req.user.role === 'admin' || 
                     req.user.role === 'staff' || 
                     (booking.user_id === req.user.id && status === 'cancelled');
    
    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    // Update booking status
    const updateQuery = `
      UPDATE bookings 
      SET status = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $2 
      RETURNING *
    `;
    
    const result = await db.query(updateQuery, [status, id]);
    
    res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating booking status'
    });
  }
};

// Update booking details
const updateBooking = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }
    
    const { id } = req.params;
    const { start_time, end_time, purpose } = req.body;
    
    // Check if booking exists
    const bookingResult = await db.query(
      'SELECT * FROM bookings WHERE id = $1',
      [id]
    );
    
    if (bookingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    const booking = bookingResult.rows[0];
    
    // Check permissions
    const canUpdate = req.user.role === 'admin' || 
                     req.user.role === 'staff' || 
                     booking.user_id === req.user.id;
    
    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    // Validate new booking times if provided
    if (start_time && end_time) {
      const startDate = new Date(start_time);
      const endDate = new Date(end_time);
      const now = new Date();
      
      if (startDate <= now) {
        return res.status(400).json({
          success: false,
          message: 'Booking start time must be in the future'
        });
      }
      
      if (endDate <= startDate) {
        return res.status(400).json({
          success: false,
          message: 'End time must be after start time'
        });
      }
      
      // Check for conflicts (excluding current booking)
      const conflicts = await checkBookingConflicts(
        booking.resource_id, 
        start_time, 
        end_time, 
        booking.id
      );
      
      if (conflicts.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Time slot conflicts with existing booking',
          conflicts: conflicts
        });
      }
    }
    
    // Build update query
    const updates = [];
    const params = [];
    let paramIndex = 1;
    
    if (start_time) {
      updates.push(`start_time = $${paramIndex}`);
      params.push(start_time);
      paramIndex++;
    }
    
    if (end_time) {
      updates.push(`end_time = $${paramIndex}`);
      params.push(end_time);
      paramIndex++;
    }
    
    if (purpose !== undefined) {
      updates.push(`purpose = $${paramIndex}`);
      params.push(purpose);
      paramIndex++;
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);
    
    const updateQuery = `
      UPDATE bookings 
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    
    const result = await db.query(updateQuery, params);
    
    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating booking'
    });
  }
};

// Delete booking
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if booking exists
    const bookingResult = await db.query(
      'SELECT * FROM bookings WHERE id = $1',
      [id]
    );
    
    if (bookingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    const booking = bookingResult.rows[0];
    
    // Check permissions
    const canDelete = req.user.role === 'admin' || 
                     req.user.role === 'staff' || 
                     booking.user_id === req.user.id;
    
    if (!canDelete) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    // Delete booking
    await db.query('DELETE FROM bookings WHERE id = $1', [id]);
    
    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting booking'
    });
  }
};

// Get resource availability for a specific date range
const getResourceAvailability = async (req, res) => {
  try {
    const { resource_id, start_date, end_date } = req.query;
    
    if (!resource_id || !start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: 'resource_id, start_date, and end_date are required'
      });
    }
    
    const query = `
      SELECT start_time, end_time, status
      FROM bookings 
      WHERE resource_id = $1 
      AND status IN ('confirmed', 'pending')
      AND start_time < $3 
      AND end_time > $2
      ORDER BY start_time ASC
    `;
    
    const result = await db.query(query, [resource_id, start_date, end_date]);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching availability'
    });
  }
};

module.exports = {
  getBookings,
  getUserBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  updateBooking,
  deleteBooking,
  getResourceAvailability
};