# How to Show the Database in Presentation

## 🗄️ Ways to Show Database to Professor

### **Option 1: Show Database Tables via Backend API (Easiest)**

**What to do:**
1. Open browser and go to: `http://localhost:5000/health`
2. Show this proves backend is running
3. Use browser or Postman to show API endpoints:
   - `GET http://localhost:5000/api/resources` - Shows all resources
   - `GET http://localhost:5000/api/admin/users` (need admin login) - Shows all users
   - `GET http://localhost:5000/api/bookings` - Shows bookings

**What to say:**
"Here's how our database data looks through our API. The backend gets data from database and shows it in JSON format."

---

### **Option 2: Show SQLite Database File (Recommended)**

**Steps:**
1. Navigate to your backend folder: `C:\Users\onlys\Documents\GitHub\college-resource-dashboard\backend`
2. Look for file named `database.sqlite` or `college_resource.db`
3. Download **DB Browser for SQLite** (free tool): https://sqlitebrowser.org/
4. Open the database file with DB Browser
5. Show the tables: `users`, `resources`, `bookings`

**What to say:**
"This is our actual database file. You can see we have 3 main tables with real data."

---

### **Option 3: Show Database Through Admin Panel (Live Demo)**

**Steps:**
1. Login to your app as admin (admin@college.edu / admin123)
2. Go to Admin Dashboard
3. Show:
   - User Management section (shows all users from database)
   - Resource listings (shows all resources from database)
   - Booking management (shows all bookings from database)
   - Analytics (shows data statistics)

**What to say:**
"Here you can see our database data live in the application. When I click here, it's pulling real data from our database."

---

### **Option 4: Show Database Schema/Structure**

**Steps:**
1. Open file: `backend/scripts/setupDatabase.js`
2. Show the CREATE TABLE statements
3. Explain each table structure

**What to say:**
"Here's how we designed our database. We have 3 main tables connected by foreign keys."

**Show this code:**
```sql
-- Users Table
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'student'
);

-- Resources Table  
CREATE TABLE resources (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    location TEXT,
    capacity INTEGER
);

-- Bookings Table
CREATE TABLE bookings (
    id INTEGER PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    resource_id INTEGER REFERENCES resources(id),
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    status TEXT DEFAULT 'pending'
);
```

---

## 🎯 Quick Setup Before Presentation

### **Download DB Browser (Do this now!):**
1. Go to: https://sqlitebrowser.org/
2. Download "DB Browser for SQLite"
3. Install it
4. Practice opening your database file

### **Find Your Database File:**
```bash
# Navigate to backend folder
cd backend

# Look for database file
dir *.db
# or
dir *.sqlite
```

### **Test API Endpoints:**
Open these URLs in browser (make sure backend is running):
- http://localhost:5000/health
- http://localhost:5000/api/resources

---

## 💡 What to Explain About Database

### **Database Design:**
- "We used relational database with 3 connected tables"
- "Users can have many bookings (one-to-many relationship)"
- "Resources can have many bookings (one-to-many relationship)"
- "Each booking connects one user to one resource"

### **Why We Chose This Design:**
- "Normalized database - no duplicate data"
- "Foreign keys ensure data integrity"  
- "Easy to query and get related information"
- "Scalable - can add more tables later"

### **Database Features We Implemented:**
- "Primary keys for unique identification"
- "Foreign keys for relationships"
- "Default values for status fields"
- "Unique constraints (email must be unique)"
- "Data validation before inserting"

---

## 🚀 Practice Demo Script

**When Professor Asks "Show me the database":**

1. **"Let me show you our database in multiple ways..."**

2. **Option A - Live Application:**
   - "First, here's the data live in our application"
   - Login and show admin panel
   - "This user list comes directly from our users table"

3. **Option B - Database Tool:**
   - Open DB Browser for SQLite
   - "Here's our actual database file with 3 tables"
   - Click on each table to show data
   - "You can see the relationships between tables"

4. **Option C - Code Level:**
   - Show setupDatabase.js file
   - "This is how we designed our database structure"
   - Point out foreign keys and relationships

5. **"The backend automatically creates this database when you first run the project"**

---

## ⚡ Emergency Backup (If Database Tool Doesn't Work)

**Use the Frontend Admin Panel:**
1. Login as admin
2. Go to Admin Dashboard  
3. Show user management (this is users table)
4. Go to Resources page (this is resources table)
5. Go to Bookings page (this is bookings table)
6. Say: "This admin panel is directly connected to our database tables"

---

## 🔧 Quick Commands for Demo

```bash
# Start your project
cd backend
npm run dev

# In another terminal
cd frontend  
npm start

# Check if database exists
dir *.db
dir *.sqlite
```

**Database Location:** `backend/database.sqlite` or `backend/college_resource.db`

---

**Remember:** The database is the heart of your project - it stores all users, resources, and bookings! 💾