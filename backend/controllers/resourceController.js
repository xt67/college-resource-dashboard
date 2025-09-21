const db = require('../config/database');

// Get all resources with optional filtering
const getResources = async (req, res) => {
  try {
    const { type, location, status, available } = req.query;
    let query = 'SELECT * FROM resources WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    // Add filters if provided
    if (type) {
      query += ` AND type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

    if (location) {
      query += ` AND location ILIKE $${paramIndex}`;
      params.push(`%${location}%`);
      paramIndex++;
    }

    if (status) {
      query += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (available === 'true') {
      query += ` AND available_count > 0`;
    }

    query += ' ORDER BY name ASC';

    const result = await db.query(query, params);
    
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resources',
      error: error.message
    });
  }
};

// Get a single resource by ID
const getResourceById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query('SELECT * FROM resources WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resource',
      error: error.message
    });
  }
};

// Create a new resource
const createResource = async (req, res) => {
  try {
    const { name, type, description, location, capacity, available_count } = req.body;

    // Validation
    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: 'Name and type are required'
      });
    }

    const finalCapacity = capacity || 1;
    const finalAvailableCount = available_count !== undefined ? available_count : finalCapacity;

    const result = await db.query(
      `INSERT INTO resources (name, type, description, location, capacity, available_count, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, type, description, location, finalCapacity, finalAvailableCount, 'available']
    );

    res.status(201).json({
      success: true,
      message: 'Resource created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create resource',
      error: error.message
    });
  }
};

// Update a resource
const updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, description, location, capacity, available_count, status } = req.body;

    // Check if resource exists
    const existingResource = await db.query('SELECT * FROM resources WHERE id = $1', [id]);
    
    if (existingResource.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    const current = existingResource.rows[0];
    
    // Build update query dynamically
    const updates = [];
    const params = [];
    let paramIndex = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramIndex}`);
      params.push(name);
      paramIndex++;
    }

    if (type !== undefined) {
      updates.push(`type = $${paramIndex}`);
      params.push(type);
      paramIndex++;
    }

    if (description !== undefined) {
      updates.push(`description = $${paramIndex}`);
      params.push(description);
      paramIndex++;
    }

    if (location !== undefined) {
      updates.push(`location = $${paramIndex}`);
      params.push(location);
      paramIndex++;
    }

    if (capacity !== undefined) {
      updates.push(`capacity = $${paramIndex}`);
      params.push(capacity);
      paramIndex++;
    }

    if (available_count !== undefined) {
      updates.push(`available_count = $${paramIndex}`);
      params.push(available_count);
      paramIndex++;
    }

    if (status !== undefined) {
      updates.push(`status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(id);

    const query = `UPDATE resources SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
    
    const result = await db.query(query, params);

    res.json({
      success: true,
      message: 'Resource updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating resource:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update resource',
      error: error.message
    });
  }
};

// Delete a resource
const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if resource exists and has active bookings
    const resourceCheck = await db.query('SELECT * FROM resources WHERE id = $1', [id]);
    
    if (resourceCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    // Check for active bookings
    const activeBookings = await db.query(
      'SELECT COUNT(*) as count FROM bookings WHERE resource_id = $1 AND status = $2',
      [id, 'confirmed']
    );

    if (parseInt(activeBookings.rows[0].count) > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete resource with active bookings'
      });
    }

    const result = await db.query('DELETE FROM resources WHERE id = $1 RETURNING *', [id]);

    res.json({
      success: true,
      message: 'Resource deleted successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete resource',
      error: error.message
    });
  }
};

// Get resource types (for filtering/categorization)
const getResourceTypes = async (req, res) => {
  try {
    const result = await db.query('SELECT DISTINCT type FROM resources ORDER BY type');
    
    res.json({
      success: true,
      data: result.rows.map(row => row.type)
    });
  } catch (error) {
    console.error('Error fetching resource types:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resource types',
      error: error.message
    });
  }
};

// Get resource locations (for filtering)
const getResourceLocations = async (req, res) => {
  try {
    const result = await db.query('SELECT DISTINCT location FROM resources WHERE location IS NOT NULL ORDER BY location');
    
    res.json({
      success: true,
      data: result.rows.map(row => row.location)
    });
  } catch (error) {
    console.error('Error fetching resource locations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resource locations',
      error: error.message
    });
  }
};

// Update resource availability (for booking system)
const updateResourceAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { change } = req.body; // positive to increase, negative to decrease

    if (!change || typeof change !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Valid change amount is required'
      });
    }

    const result = await db.query(
      `UPDATE resources 
       SET available_count = GREATEST(0, available_count + $1),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 
       RETURNING *`,
      [change, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    res.json({
      success: true,
      message: 'Resource availability updated',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating resource availability:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update resource availability',
      error: error.message
    });
  }
};

module.exports = {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  getResourceTypes,
  getResourceLocations,
  updateResourceAvailability
};