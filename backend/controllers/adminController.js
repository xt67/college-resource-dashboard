const db = require('../config/database');
const { validationResult } = require('express-validator');

// Get system analytics and statistics
const getSystemAnalytics = async (req, res) => {
  try {
    // Get user statistics
    const userStatsQuery = `
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN role = 'student' THEN 1 END) as students,
        COUNT(CASE WHEN role = 'staff' THEN 1 END) as staff,
        COUNT(CASE WHEN role = 'admin' THEN 1 END) as admins
      FROM users
    `;
    const userStats = await db.query(userStatsQuery);

    // Get resource statistics
    const resourceStatsQuery = `
      SELECT 
        COUNT(*) as total_resources,
        COUNT(CASE WHEN status = 'available' THEN 1 END) as available_resources,
        COUNT(CASE WHEN status = 'maintenance' THEN 1 END) as maintenance_resources,
        COUNT(CASE WHEN status = 'unavailable' THEN 1 END) as unavailable_resources,
        SUM(capacity) as total_capacity,
        SUM(available_count) as total_available
      FROM resources
    `;
    const resourceStats = await db.query(resourceStatsQuery);

    // Get booking statistics
    const bookingStatsQuery = `
      SELECT 
        COUNT(*) as total_bookings,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_bookings,
        COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_bookings,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_bookings,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_bookings
      FROM bookings
    `;
    const bookingStats = await db.query(bookingStatsQuery);

    // Get booking trends (last 30 days)
    const bookingTrendsQuery = `
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as bookings_count
      FROM bookings 
      WHERE created_at >= datetime('now', '-30 days')
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30
    `;
    const bookingTrends = await db.query(bookingTrendsQuery);

    // Get most popular resources
    const popularResourcesQuery = `
      SELECT 
        r.id,
        r.name,
        r.type,
        r.location,
        COUNT(b.id) as booking_count
      FROM resources r
      LEFT JOIN bookings b ON r.id = b.resource_id
      GROUP BY r.id, r.name, r.type, r.location
      ORDER BY booking_count DESC
      LIMIT 10
    `;
    const popularResources = await db.query(popularResourcesQuery);

    // Get recent activity
    const recentActivityQuery = `
      SELECT 
        b.id,
        b.status,
        b.created_at,
        u.name as user_name,
        u.email as user_email,
        r.name as resource_name,
        r.type as resource_type
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN resources r ON b.resource_id = r.id
      ORDER BY b.created_at DESC
      LIMIT 20
    `;
    const recentActivity = await db.query(recentActivityQuery);

    res.json({
      success: true,
      data: {
        userStats: userStats.rows[0],
        resourceStats: resourceStats.rows[0],
        bookingStats: bookingStats.rows[0],
        bookingTrends: bookingTrends.rows,
        popularResources: popularResources.rows,
        recentActivity: recentActivity.rows
      }
    });
  } catch (error) {
    console.error('Error fetching system analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching system analytics'
    });
  }
};

// Get all users with pagination and filtering
const getUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT id, email, name, role, department, created_at
      FROM users
      WHERE 1=1
    `;
    
    const params = [];
    let paramIndex = 1;
    
    if (role) {
      query += ` AND role = $${paramIndex}`;
      params.push(role);
      paramIndex++;
    }
    
    if (search) {
      query += ` AND (name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);
    
    const result = await db.query(query, params);
    
    // Get total count for pagination
    let countQuery = `SELECT COUNT(*) as total FROM users WHERE 1=1`;
    const countParams = [];
    let countParamIndex = 1;
    
    if (role) {
      countQuery += ` AND role = $${countParamIndex}`;
      countParams.push(role);
      countParamIndex++;
    }
    
    if (search) {
      countQuery += ` AND (name ILIKE $${countParamIndex} OR email ILIKE $${countParamIndex})`;
      countParams.push(`%${search}%`);
    }
    
    const countResult = await db.query(countQuery, countParams);
    const total = countResult.rows[0].total;
    
    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(total),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
};

// Update user role or status
const updateUser = async (req, res) => {
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
    const { role, department } = req.body;

    // Check if user exists
    const userResult = await db.query(
      'SELECT id, email, role FROM users WHERE id = $1',
      [id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = userResult.rows[0];

    // Prevent admin from changing their own role
    if (user.id === req.user.id && role && role !== user.role) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change your own role'
      });
    }

    // Build update query
    const updates = [];
    const params = [];
    let paramIndex = 1;

    if (role) {
      updates.push(`role = $${paramIndex}`);
      params.push(role);
      paramIndex++;
    }

    if (department !== undefined) {
      updates.push(`department = $${paramIndex}`);
      params.push(department);
      paramIndex++;
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No updates provided'
      });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    const updateQuery = `
      UPDATE users 
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, email, name, role, department, created_at, updated_at
    `;

    const result = await db.query(updateQuery, params);

    res.json({
      success: true,
      message: 'User updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user'
    });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const userResult = await db.query(
      'SELECT id, email, role FROM users WHERE id = $1',
      [id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = userResult.rows[0];

    // Prevent admin from deleting themselves
    if (user.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    // Delete user (cascading will handle related records)
    await db.query('DELETE FROM users WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user'
    });
  }
};

// Get system health and performance metrics
const getSystemHealth = async (req, res) => {
  try {
    // Database health check
    const dbHealthQuery = 'SELECT 1 as health_check';
    const dbHealth = await db.query(dbHealthQuery);
    
    // Get database size (SQLite specific)
    let dbSizeQuery;
    if (db.isPostgreSQL()) {
      dbSizeQuery = "SELECT pg_size_pretty(pg_database_size(current_database())) as size";
    } else {
      dbSizeQuery = "SELECT 'N/A' as size"; // SQLite size would require file system access
    }
    
    const dbSize = await db.query(dbSizeQuery);

    // Performance metrics
    const startTime = Date.now();
    await db.query('SELECT COUNT(*) FROM users');
    const queryTime = Date.now() - startTime;

    res.json({
      success: true,
      data: {
        database: {
          status: dbHealth.rows.length > 0 ? 'healthy' : 'unhealthy',
          type: db.isPostgreSQL() ? 'PostgreSQL' : 'SQLite',
          size: dbSize.rows[0].size,
          queryTime: `${queryTime}ms`
        },
        server: {
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          nodeVersion: process.version,
          platform: process.platform
        },
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching system health:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching system health'
    });
  }
};

// Generate reports
const generateReport = async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;

    if (!type) {
      return res.status(400).json({
        success: false,
        message: 'Report type is required'
      });
    }

    let reportData = {};

    switch (type) {
      case 'bookings':
        // Booking report
        let bookingQuery = `
          SELECT 
            b.id,
            b.start_time,
            b.end_time,
            b.status,
            b.purpose,
            b.created_at,
            u.name as user_name,
            u.email as user_email,
            u.role as user_role,
            r.name as resource_name,
            r.type as resource_type,
            r.location as resource_location
          FROM bookings b
          JOIN users u ON b.user_id = u.id
          JOIN resources r ON b.resource_id = r.id
          WHERE 1=1
        `;
        
        const bookingParams = [];
        let bookingParamIndex = 1;
        
        if (startDate) {
          bookingQuery += ` AND b.created_at >= $${bookingParamIndex}`;
          bookingParams.push(startDate);
          bookingParamIndex++;
        }
        
        if (endDate) {
          bookingQuery += ` AND b.created_at <= $${bookingParamIndex}`;
          bookingParams.push(endDate);
        }
        
        bookingQuery += ` ORDER BY b.created_at DESC`;
        
        const bookingResult = await db.query(bookingQuery, bookingParams);
        reportData = {
          type: 'Booking Report',
          period: { startDate, endDate },
          bookings: bookingResult.rows,
          summary: {
            total: bookingResult.rows.length,
            pending: bookingResult.rows.filter(b => b.status === 'pending').length,
            confirmed: bookingResult.rows.filter(b => b.status === 'confirmed').length,
            cancelled: bookingResult.rows.filter(b => b.status === 'cancelled').length,
            completed: bookingResult.rows.filter(b => b.status === 'completed').length
          }
        };
        break;

      case 'resources':
        // Resource utilization report
        const resourceQuery = `
          SELECT 
            r.id,
            r.name,
            r.type,
            r.location,
            r.capacity,
            r.available_count,
            r.status,
            COUNT(b.id) as total_bookings,
            COUNT(CASE WHEN b.status = 'completed' THEN 1 END) as completed_bookings
          FROM resources r
          LEFT JOIN bookings b ON r.id = b.resource_id
          GROUP BY r.id, r.name, r.type, r.location, r.capacity, r.available_count, r.status
          ORDER BY total_bookings DESC
        `;
        
        const resourceResult = await db.query(resourceQuery);
        reportData = {
          type: 'Resource Utilization Report',
          resources: resourceResult.rows,
          summary: {
            total: resourceResult.rows.length,
            available: resourceResult.rows.filter(r => r.status === 'available').length,
            maintenance: resourceResult.rows.filter(r => r.status === 'maintenance').length,
            unavailable: resourceResult.rows.filter(r => r.status === 'unavailable').length,
            totalCapacity: resourceResult.rows.reduce((sum, r) => sum + r.capacity, 0),
            totalBookings: resourceResult.rows.reduce((sum, r) => sum + r.total_bookings, 0)
          }
        };
        break;

      case 'users':
        // User activity report
        const userQuery = `
          SELECT 
            u.id,
            u.name,
            u.email,
            u.role,
            u.department,
            u.created_at,
            COUNT(b.id) as total_bookings,
            COUNT(CASE WHEN b.status = 'completed' THEN 1 END) as completed_bookings,
            MAX(b.created_at) as last_booking
          FROM users u
          LEFT JOIN bookings b ON u.id = b.user_id
          GROUP BY u.id, u.name, u.email, u.role, u.department, u.created_at
          ORDER BY total_bookings DESC
        `;
        
        const userResult = await db.query(userQuery);
        reportData = {
          type: 'User Activity Report',
          users: userResult.rows,
          summary: {
            total: userResult.rows.length,
            students: userResult.rows.filter(u => u.role === 'student').length,
            staff: userResult.rows.filter(u => u.role === 'staff').length,
            admins: userResult.rows.filter(u => u.role === 'admin').length,
            activeUsers: userResult.rows.filter(u => u.total_bookings > 0).length
          }
        };
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid report type'
        });
    }

    res.json({
      success: true,
      data: reportData,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating report'
    });
  }
};

module.exports = {
  getSystemAnalytics,
  getUsers,
  updateUser,
  deleteUser,
  getSystemHealth,
  generateReport
};