const { Pool } = require('pg');
const SQLiteDatabase = require('./sqlite');
require('dotenv').config();

let database;
let usingPostgreSQL = true;

// Try PostgreSQL first, fallback to SQLite
const initializeDatabase = async () => {
  try {
    // Test PostgreSQL connection
    const testPool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: 'postgres', // Connect to default database first
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectionTimeoutMillis: 3000,
    });

    const testClient = await testPool.connect();
    testClient.release();
    testPool.end();

    // If successful, use PostgreSQL
    database = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'college_resource_db',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    console.log('📊 Using PostgreSQL database');
    usingPostgreSQL = true;

  } catch (error) {
    console.warn('⚠️  PostgreSQL not available, falling back to SQLite');
    console.warn('   Error:', error.message);
    console.log('📊 Using SQLite database for development');
    
    database = new SQLiteDatabase();
    usingPostgreSQL = false;
  }
};

// Initialize database connection
initializeDatabase();

// Function to execute queries
const query = async (text, params) => {
  const start = Date.now();
  try {
    if (!database) {
      await initializeDatabase();
    }
    
    const res = await database.query(text, params);
    const duration = Date.now() - start;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📋 Query executed:', { 
        text: text.substring(0, 100) + (text.length > 100 ? '...' : ''), 
        duration, 
        rows: res.rowCount 
      });
    }
    
    return res;
  } catch (error) {
    console.error('❌ Query error:', error);
    throw error;
  }
};

// Function to get a client from the pool
const getClient = () => {
  if (!database) {
    throw new Error('Database not initialized');
  }
  return database.connect();
};

// Check if using PostgreSQL
const isPostgreSQL = () => usingPostgreSQL;

// Close database connection
const closeConnection = () => {
  if (database) {
    return database.end();
  }
};

module.exports = {
  query,
  getClient,
  isPostgreSQL,
  closeConnection,
  pool: database // For backwards compatibility
};