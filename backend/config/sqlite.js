const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class SQLiteDatabase {
  constructor() {
    const dbPath = path.join(__dirname, '../data/college_resource.db');
    
    // Ensure data directory exists
    const dataDir = path.dirname(dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('❌ SQLite connection error:', err);
      } else {
        console.log('📊 Connected to SQLite database');
      }
    });
    
    // Enable foreign keys
    this.db.run('PRAGMA foreign_keys = ON');
  }

  // Convert PostgreSQL query to SQLite compatible query
  convertQuery(text, params = []) {
    // Convert $1, $2, etc. to ? placeholders
    let convertedText = text;
    
    // Replace parameters in correct order (highest to lowest to avoid conflicts)
    for (let i = params.length; i >= 1; i--) {
      const regex = new RegExp(`\\$${i}`, 'g');
      convertedText = convertedText.replace(regex, '?');
    }
    
    // Convert PostgreSQL-specific syntax to SQLite
    convertedText = convertedText
      .replace(/SERIAL/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT')
      .replace(/VARCHAR\(\d+\)/gi, 'TEXT')
      .replace(/TIMESTAMP/gi, 'DATETIME')
      .replace(/CURRENT_TIMESTAMP/gi, 'CURRENT_TIMESTAMP')
      .replace(/JSONB/gi, 'TEXT');
    
    return { text: convertedText, params };
  }

  // Query method compatible with pg
  query(text, params = []) {
    return new Promise((resolve, reject) => {
      const { text: convertedText, params: convertedParams } = this.convertQuery(text, params);
      
      if (convertedText.trim().toUpperCase().startsWith('SELECT') || 
          convertedText.trim().toUpperCase().startsWith('RETURNING')) {
        this.db.all(convertedText, convertedParams, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve({ rows, rowCount: rows.length });
          }
        });
      } else {
        this.db.run(convertedText, convertedParams, function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ 
              rows: [], 
              rowCount: this.changes,
              lastID: this.lastID 
            });
          }
        });
      }
    });
  }

  // Get a client (for compatibility with pg)
  connect() {
    return Promise.resolve({
      query: this.query.bind(this),
      release: () => {}
    });
  }

  // End connection
  end() {
    return new Promise((resolve) => {
      this.db.close((err) => {
        if (err) {
          console.error('❌ Error closing SQLite database:', err);
        } else {
          console.log('📊 SQLite database connection closed');
        }
        resolve();
      });
    });
  }
}

module.exports = SQLiteDatabase;