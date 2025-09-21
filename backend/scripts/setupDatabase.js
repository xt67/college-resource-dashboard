const db = require('../config/database');
const bcrypt = require('bcryptjs');

// Wait for database initialization
const waitForDatabase = () => {
  return new Promise((resolve) => {
    setTimeout(resolve, 1000); // Give database time to initialize
  });
};

const createTables = async () => {
  const isPostgreSQL = db.isPostgreSQL();
  
  if (isPostgreSQL) {
    console.log('� Setting up PostgreSQL tables...');
    
    // PostgreSQL schema
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'student',
        department VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS resources (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(100) NOT NULL,
        description TEXT,
        location VARCHAR(255),
        capacity INTEGER DEFAULT 1,
        available_count INTEGER DEFAULT 1,
        status VARCHAR(50) DEFAULT 'available',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        resource_id INTEGER REFERENCES resources(id) ON DELETE CASCADE,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        purpose TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        action VARCHAR(255) NOT NULL,
        resource_type VARCHAR(100),
        resource_id INTEGER,
        details JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } else {
    console.log('� Setting up SQLite tables...');
    
    // SQLite schema
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT DEFAULT 'student',
        department TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS resources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        description TEXT,
        location TEXT,
        capacity INTEGER DEFAULT 1,
        available_count INTEGER DEFAULT 1,
        status TEXT DEFAULT 'available',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        resource_id INTEGER REFERENCES resources(id) ON DELETE CASCADE,
        start_time DATETIME NOT NULL,
        end_time DATETIME NOT NULL,
        status TEXT DEFAULT 'pending',
        purpose TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        action TEXT NOT NULL,
        resource_type TEXT,
        resource_id INTEGER,
        details TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  console.log('✅ Tables created successfully');
};

const seedData = async () => {
  // Create admin user
  const adminEmail = 'admin@college.edu';
  const adminPassword = await bcrypt.hash('admin123', 10);

  try {
    if (db.isPostgreSQL()) {
      await db.query(`
        INSERT INTO users (email, password, name, role, department)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (email) DO NOTHING
      `, [adminEmail, adminPassword, 'System Admin', 'admin', 'IT']);
    } else {
      await db.query(`
        INSERT OR IGNORE INTO users (email, password, name, role, department)
        VALUES (?, ?, ?, ?, ?)
      `, [adminEmail, adminPassword, 'System Admin', 'admin', 'IT']);
    }

    console.log('✅ Admin user created (email: admin@college.edu, password: admin123)');
  } catch (error) {
    console.log('ℹ️  Admin user already exists or error:', error.message);
  }

  // Seed some sample resources
  const resources = [
    ['Laptop - Dell Latitude', 'Equipment', 'Dell Latitude 5520 with Windows 11', 'IT Lab Room 101', 10, 8],
    ['Projector - Epson', 'Equipment', 'Epson PowerLite projector with HDMI', 'Media Room 205', 3, 3],
    ['Conference Room A', 'Room', '20-person conference room with whiteboard', 'Building A, Floor 2', 1, 1],
    ['Study Room 1', 'Room', 'Quiet study room for 4 people', 'Library, Floor 1', 1, 1],
    ['Chemistry Lab Kit', 'Equipment', 'Complete chemistry lab equipment set', 'Science Building Lab 301', 5, 4]
  ];

  for (const resource of resources) {
    try {
      if (db.isPostgreSQL()) {
        await db.query(`
          INSERT INTO resources (name, type, description, location, capacity, available_count)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT DO NOTHING
        `, resource);
      } else {
        await db.query(`
          INSERT OR IGNORE INTO resources (name, type, description, location, capacity, available_count)
          VALUES (?, ?, ?, ?, ?, ?)
        `, resource);
      }
    } catch (error) {
      // Resource might already exist, continue
    }
  }

  console.log('✅ Sample resources created');
};

const setupDatabase = async () => {
  try {
    console.log('🚀 Setting up College Resource Dashboard database...\n');
    
    // Wait for database to initialize
    await waitForDatabase();
    
    // Create tables
    await createTables();
    
    // Seed initial data
    await seedData();
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('👤 Admin login: admin@college.edu / admin123');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
};

const testConnection = async () => {
  try {
    await waitForDatabase();
    
    const result = await db.query('SELECT 1 as test');
    console.log('✅ Database connection test successful');
    console.log(`📊 Using ${db.isPostgreSQL() ? 'PostgreSQL' : 'SQLite'} database`);
    
    // Test if tables exist
    const userCount = await db.query('SELECT COUNT(*) as count FROM users');
    console.log(`👥 Users in database: ${userCount.rows[0].count}`);
    
    const resourceCount = await db.query('SELECT COUNT(*) as count FROM resources');
    console.log(`📦 Resources in database: ${resourceCount.rows[0].count}`);
    
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    return false;
  }
};

// Command line interface
if (require.main === module) {
  const command = process.argv[2];
  
  if (command === 'test') {
    testConnection().then(() => process.exit(0));
  } else {
    setupDatabase().then(() => process.exit(0));
  }
}

module.exports = { setupDatabase, testConnection };