# College Resource Dashboard - Project Report

## Executive Summary

The College Resource Dashboard is a full-stack web application designed to streamline the management and booking of college resources such as equipment, rooms, and facilities. The system provides a centralized platform for students and staff to view, reserve, and manage resources efficiently while offering administrators comprehensive oversight and analytics.

**Project Timeline**: Started September 2025 | Current Version: 1.0.0  
**Development Duration**: Approximately 4-6 weeks  
**Status**: Production-Ready

---

## 1. Project Overview

### 1.1 Problem Statement
Colleges face challenges in managing shared resources efficiently:
- Manual booking processes leading to scheduling conflicts
- Lack of real-time resource availability information
- Difficulty tracking resource usage and generating reports
- No centralized system for resource management
- Limited visibility into resource utilization patterns

### 1.2 Solution
A web-based dashboard that provides:
- **Real-time resource availability** tracking
- **Automated booking system** with conflict detection
- **Role-based access control** (Admin, Staff, Student)
- **Analytics and reporting** for data-driven decisions
- **Mobile-responsive interface** for access anywhere
- **Search and filtering** capabilities for easy resource discovery

### 1.3 Key Features
- ✅ User Authentication & Authorization
- ✅ Resource Management (CRUD operations)
- ✅ Booking/Reservation System
- ✅ Admin Dashboard with User Management
- ✅ Advanced Analytics & Reporting
- ✅ Search & Filter Functionality
- ✅ Notification System
- ✅ Mobile-Responsive Design
- ✅ RESTful API Architecture

---

## 2. Technology Stack

### 2.1 Frontend Technologies

#### **React.js (v18.x)**
- **Purpose**: Building the user interface
- **Why Used**: 
  - Component-based architecture for reusability
  - Virtual DOM for optimal performance
  - Large ecosystem and community support
  - Easy state management

#### **Material-UI (MUI v5)**
- **Purpose**: UI component library
- **Why Used**:
  - Pre-built, customizable components
  - Professional, modern design
  - Built-in theming and responsiveness
  - Accessibility features

#### **React Router (v6)**
- **Purpose**: Client-side routing
- **Why Used**:
  - Seamless navigation without page reloads
  - Protected routes for authentication
  - Dynamic URL handling

#### **Axios**
- **Purpose**: HTTP client for API requests
- **Why Used**:
  - Promise-based API
  - Automatic JSON transformation
  - Interceptors for request/response handling
  - Better error handling than fetch

#### **Chart.js with react-chartjs-2**
- **Purpose**: Data visualization
- **Why Used**:
  - Interactive charts and graphs
  - Multiple chart types (bar, line, pie, doughnut)
  - Responsive and animated visualizations

#### **React Query (TanStack Query)**
- **Purpose**: Server state management
- **Why Used**:
  - Automatic caching and synchronization
  - Background data refetching
  - Optimistic updates
  - Reduces boilerplate code

### 2.2 Backend Technologies

#### **Node.js (v18.x+)**
- **Purpose**: Runtime environment
- **Why Used**:
  - JavaScript on both frontend and backend
  - Non-blocking I/O for high performance
  - NPM ecosystem with vast libraries
  - Event-driven architecture

#### **Express.js (v4.x)**
- **Purpose**: Web application framework
- **Why Used**:
  - Minimalist and flexible
  - Robust routing system
  - Middleware support
  - Large community and plugins

#### **JSON Web Tokens (JWT)**
- **Purpose**: Authentication mechanism
- **Why Used**:
  - Stateless authentication
  - Secure token-based system
  - Easy to implement across platforms
  - Self-contained user information

#### **bcrypt**
- **Purpose**: Password hashing
- **Why Used**:
  - Industry-standard encryption
  - Salt rounds for enhanced security
  - Protection against rainbow table attacks

#### **express-rate-limit**
- **Purpose**: API rate limiting
- **Why Used**:
  - Prevent abuse and DDoS attacks
  - Protect server resources
  - Customizable limits per endpoint

### 2.3 Database Technologies

#### **PostgreSQL (Production)**
- **Purpose**: Primary relational database
- **Why Used**:
  - ACID compliance for data integrity
  - Advanced features (JSON support, full-text search)
  - Scalability and reliability
  - Open-source and well-documented

#### **SQLite (Development)**
- **Purpose**: Development database
- **Why Used**:
  - Zero configuration required
  - File-based database
  - Perfect for local development
  - Easy to set up and test

### 2.4 Development Tools

#### **Nodemon**
- **Purpose**: Auto-restart development server
- **Why Used**: Automatically restarts server on file changes

#### **dotenv**
- **Purpose**: Environment variable management
- **Why Used**: Secure configuration and secrets management

#### **CORS**
- **Purpose**: Cross-Origin Resource Sharing
- **Why Used**: Enable frontend-backend communication

#### **Jest & Supertest**
- **Purpose**: Testing framework
- **Why Used**: Automated API testing and quality assurance

---

## 3. System Architecture

### 3.1 Architecture Pattern
**Three-Tier Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                       │
│  (React Frontend - Port 3000)                               │
│  - User Interface Components                                 │
│  - State Management (Context API)                           │
│  - Client-side Routing                                      │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/REST API
┌─────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER                        │
│  (Express.js Backend - Port 5000)                           │
│  - RESTful API Endpoints                                    │
│  - Business Logic & Controllers                             │
│  - Authentication & Authorization                           │
│  - Middleware (Auth, Rate Limiting, Error Handling)         │
└─────────────────────────────────────────────────────────────┘
                            ↕ SQL Queries
┌─────────────────────────────────────────────────────────────┐
│                       DATA LAYER                            │
│  (PostgreSQL / SQLite)                                      │
│  - Database Tables & Relationships                          │
│  - Data Persistence                                         │
│  - Query Optimization                                       │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Project Structure

```
college-resource-dashboard/
│
├── backend/                      # Server-side application
│   ├── config/                   # Configuration files
│   │   ├── database.js          # Database connection setup
│   │   └── env.js               # Environment configuration
│   │
│   ├── controllers/              # Business logic handlers
│   │   ├── authController.js    # Authentication logic
│   │   ├── resourceController.js # Resource management
│   │   ├── bookingController.js  # Booking operations
│   │   ├── userController.js     # User management
│   │   └── adminController.js    # Admin operations
│   │
│   ├── middleware/               # Express middleware
│   │   ├── auth.js              # JWT verification
│   │   ├── roleCheck.js         # Role-based access control
│   │   └── errorHandler.js      # Global error handling
│   │
│   ├── routes/                   # API route definitions
│   │   ├── auth.js              # /api/auth/*
│   │   ├── resources.js         # /api/resources/*
│   │   ├── bookings.js          # /api/bookings/*
│   │   ├── users.js             # /api/users/*
│   │   └── admin.js             # /api/admin/*
│   │
│   ├── scripts/                  # Utility scripts
│   │   └── setupDatabase.js     # Database initialization
│   │
│   ├── tests/                    # Test suites
│   │   └── api.test.js          # API endpoint tests
│   │
│   ├── .env                      # Environment variables
│   ├── server.js                 # Application entry point
│   └── package.json              # Dependencies & scripts
│
├── frontend/                     # Client-side application
│   ├── public/                   # Static assets
│   │   ├── index.html           # HTML template
│   │   └── favicon.ico          # Application icon
│   │
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Navbar.js        # Navigation bar
│   │   │   ├── ProtectedRoute.js # Route guard
│   │   │   └── ...
│   │   │
│   │   ├── contexts/            # React Context providers
│   │   │   └── AuthContext.js   # Authentication state
│   │   │
│   │   ├── pages/               # Page components
│   │   │   ├── Login.js         # Login page
│   │   │   ├── Register.js      # Registration page
│   │   │   ├── Dashboard.js     # Main dashboard
│   │   │   ├── Resources.js     # Resource listing
│   │   │   ├── Bookings.js      # Booking management
│   │   │   ├── Admin.js         # Admin panel
│   │   │   └── Analytics.js     # Analytics dashboard
│   │   │
│   │   ├── services/            # API service layer
│   │   │   ├── api.js           # Axios configuration
│   │   │   └── notificationService.js # Toast notifications
│   │   │
│   │   ├── utils/               # Utility functions
│   │   │   └── auth.js          # Auth helper functions
│   │   │
│   │   ├── App.js               # Root component
│   │   ├── index.js             # Application entry point
│   │   └── index.css            # Global styles
│   │
│   └── package.json             # Frontend dependencies
│
├── .vscode/                     # VS Code configuration
│   └── tasks.json              # Build/run tasks
│
├── .github/                     # GitHub configuration
│   └── copilot-instructions.md # Development guidelines
│
├── README.md                    # Project documentation
├── API_DOCUMENTATION.md         # API reference guide
├── USER_GUIDE.md               # End-user manual
└── PROJECT_REPORT.md           # This file
```

---

## 4. Database Design

### 4.1 Database Schema

#### **Users Table**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'student',
    department VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose**: Store user information and credentials  
**Relationships**: One-to-many with bookings

#### **Resources Table**
```sql
CREATE TABLE resources (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    capacity INTEGER,
    status VARCHAR(50) DEFAULT 'available',
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose**: Store resource information  
**Relationships**: One-to-many with bookings

#### **Bookings Table**
```sql
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    resource_id INTEGER REFERENCES resources(id),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    purpose TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose**: Store reservation information  
**Relationships**: 
- Many-to-one with users
- Many-to-one with resources

### 4.2 Entity Relationship Diagram

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│    USERS     │         │   BOOKINGS   │         │  RESOURCES   │
├──────────────┤         ├──────────────┤         ├──────────────┤
│ id (PK)      │◄───────┤ user_id (FK) │         │ id (PK)      │
│ email        │    1    │ resource_id  ├────────►│ name         │
│ password     │         │ start_time   │    *    │ type         │
│ name         │         │ end_time     │         │ description  │
│ role         │         │ status       │         │ location     │
│ department   │         │ purpose      │         │ capacity     │
│ created_at   │         │ created_at   │         │ status       │
│ updated_at   │         │ updated_at   │         │ image_url    │
└──────────────┘         └──────────────┘         │ created_at   │
                                                   │ updated_at   │
                                                   └──────────────┘
```

---

## 5. API Architecture

### 5.1 RESTful API Design

All API endpoints follow REST principles with proper HTTP methods:

#### **Authentication Endpoints** (`/api/auth`)
```
POST   /api/auth/register     - Create new user account
POST   /api/auth/login        - Authenticate user
POST   /api/auth/logout       - End user session
GET    /api/auth/me           - Get current user info
```

#### **Resource Endpoints** (`/api/resources`)
```
GET    /api/resources         - List all resources (with filters)
GET    /api/resources/:id     - Get single resource
POST   /api/resources         - Create new resource (Admin/Staff)
PUT    /api/resources/:id     - Update resource (Admin/Staff)
DELETE /api/resources/:id     - Delete resource (Admin only)
GET    /api/resources/types   - Get resource types
```

#### **Booking Endpoints** (`/api/bookings`)
```
GET    /api/bookings          - List user's bookings
GET    /api/bookings/:id      - Get booking details
POST   /api/bookings          - Create new booking
PUT    /api/bookings/:id      - Update booking
DELETE /api/bookings/:id      - Cancel booking
GET    /api/bookings/resource/:id - Get resource bookings
```

#### **User Endpoints** (`/api/users`)
```
GET    /api/users/profile     - Get user profile
PUT    /api/users/profile     - Update user profile
PUT    /api/users/password    - Change password
```

#### **Admin Endpoints** (`/api/admin`)
```
GET    /api/admin/users       - List all users
PUT    /api/admin/users/:id   - Update user (role, status)
DELETE /api/admin/users/:id   - Delete user
GET    /api/admin/analytics   - Get system analytics
GET    /api/admin/bookings    - List all bookings
```

### 5.2 Authentication Flow

```
1. User Registration/Login
   ↓
2. Backend validates credentials
   ↓
3. Generate JWT token with user info
   ↓
4. Send token to client
   ↓
5. Client stores token (localStorage)
   ↓
6. Client includes token in Authorization header
   ↓
7. Backend verifies token on protected routes
   ↓
8. Grant/Deny access based on role
```

---

## 6. Security Features

### 6.1 Implemented Security Measures

1. **Password Security**
   - Bcrypt hashing with salt rounds (10)
   - No plain-text password storage
   - Password strength validation

2. **JWT Authentication**
   - Signed tokens with secret key
   - Token expiration (24 hours)
   - Secure token transmission

3. **Role-Based Access Control (RBAC)**
   - Three roles: Admin, Staff, Student
   - Route-level authorization
   - Function-level permissions

4. **API Protection**
   - Rate limiting (100 requests per 15 minutes)
   - CORS configuration
   - Input validation and sanitization

5. **Environment Security**
   - Environment variables for secrets
   - .env files excluded from Git
   - Separate dev/production configs

6. **SQL Injection Prevention**
   - Parameterized queries
   - ORM-like query builders
   - Input sanitization

---

## 7. Development Process

### 7.1 Development Methodology

**Iterative Development Approach**

1. **Planning Phase**
   - Requirements gathering
   - Technology selection
   - Architecture design

2. **Backend Development**
   - Database schema design
   - API endpoint creation
   - Authentication implementation
   - Testing with Postman/curl

3. **Frontend Development**
   - Component structure planning
   - UI/UX design with Material-UI
   - State management setup
   - API integration

4. **Integration Phase**
   - Connect frontend to backend
   - End-to-end testing
   - Bug fixes and optimization

5. **Enhancement Phase**
   - Advanced features (analytics, notifications)
   - Performance optimization
   - Documentation

### 7.2 Version Control

**Git Workflow**
- Repository hosted on GitHub
- Commits with descriptive messages
- Feature-based development
- Regular backups and versioning

### 7.3 Testing Strategy

1. **Backend Testing**
   - Jest test framework
   - Supertest for API testing
   - Unit tests for controllers
   - Integration tests for routes

2. **Frontend Testing**
   - Manual UI testing
   - Browser compatibility testing
   - Responsive design testing

3. **Security Testing**
   - Authentication flow testing
   - Authorization testing
   - Input validation testing

---

## 8. Key Features Implementation

### 8.1 Authentication System

**Implementation Details:**
- User registration with validation
- Login with email/password
- JWT token generation and verification
- Protected routes in frontend
- Automatic token refresh
- Logout functionality

**Code Highlights:**
```javascript
// JWT Token Generation
const token = jwt.sign(
  { id: user.id, email: user.email, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);

// Middleware Protection
const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  // Verify and decode token
};
```

### 8.2 Resource Management

**Features:**
- CRUD operations for resources
- Search by name, type, location
- Filter by availability, capacity
- Sort by various criteria
- Image upload support
- Real-time status updates

### 8.3 Booking System

**Features:**
- Date/time picker for reservations
- Conflict detection
- Booking approval workflow
- Status tracking (pending, approved, completed, cancelled)
- Email notifications (planned)
- Calendar view integration

### 8.4 Admin Dashboard

**Features:**
- User management (view, edit, delete)
- System analytics and statistics
- Booking oversight
- Resource utilization reports
- Data export capabilities

### 8.5 Analytics Dashboard

**Visualizations:**
- Resource usage over time (line chart)
- Booking status distribution (pie chart)
- Popular resources (bar chart)
- User activity trends (doughnut chart)
- Department-wise usage statistics

---

## 9. Challenges and Solutions

### 9.1 Technical Challenges

**Challenge 1: Database Flexibility**
- **Problem**: Need to support both PostgreSQL (production) and SQLite (development)
- **Solution**: Implemented database abstraction layer with automatic detection and fallback

**Challenge 2: Authentication State Management**
- **Problem**: Maintaining auth state across page refreshes
- **Solution**: Used Context API with localStorage persistence

**Challenge 3: Booking Conflicts**
- **Problem**: Preventing double-booking of resources
- **Solution**: Server-side validation checking time overlaps before confirmation

**Challenge 4: Role-Based Access**
- **Problem**: Different permissions for different user types
- **Solution**: Implemented middleware-based role checking on both frontend and backend

**Challenge 5: Mobile Responsiveness**
- **Problem**: Complex dashboards on small screens
- **Solution**: Material-UI's responsive Grid system and mobile-first design

### 9.2 Lessons Learned

1. **Planning is crucial** - Proper database design saves refactoring time
2. **Security first** - Implement auth early in development
3. **Modular code** - Component-based architecture improves maintainability
4. **Documentation matters** - Good docs help with debugging and future enhancements
5. **Testing saves time** - Automated tests catch bugs before deployment

---

## 10. Performance Optimization

### 10.1 Frontend Optimizations

1. **Code Splitting**
   - Lazy loading of routes
   - Component-level code splitting
   - Reduced initial bundle size

2. **Caching Strategy**
   - React Query for server state caching
   - LocalStorage for auth tokens
   - Browser caching for static assets

3. **UI Performance**
   - Debounced search inputs
   - Pagination for large lists
   - Optimistic UI updates

### 10.2 Backend Optimizations

1. **Database Queries**
   - Indexed columns for faster searches
   - Query optimization
   - Connection pooling

2. **API Efficiency**
   - Rate limiting to prevent abuse
   - Gzip compression
   - Response pagination

3. **Caching**
   - Future: Redis for session storage
   - Future: CDN for static assets

---

## 11. Future Enhancements

### 11.1 Planned Features

1. **Email Notifications**
   - Booking confirmations
   - Reminder emails
   - Status update notifications

2. **Calendar Integration**
   - Google Calendar sync
   - iCal export
   - Calendar widget view

3. **Advanced Analytics**
   - Predictive analytics
   - Resource utilization forecasting
   - Custom report generation

4. **Mobile App**
   - React Native mobile application
   - Push notifications
   - Offline mode support

5. **QR Code Integration**
   - QR codes for resources
   - Check-in/check-out via QR scanning
   - Digital resource tags

6. **Payment Integration**
   - Paid resource bookings
   - Stripe/PayPal integration
   - Invoice generation

### 11.2 Scalability Improvements

1. **Microservices Architecture**
2. **Load Balancing**
3. **Database Replication**
4. **CDN Integration**
5. **Containerization (Docker)**

---

## 12. Installation and Deployment

### 12.1 Development Setup

**Prerequisites:**
- Node.js (v18 or higher)
- PostgreSQL (optional, SQLite fallback available)
- Git

**Installation Steps:**

```bash
# 1. Clone repository
git clone https://github.com/xt67/college-resource-dashboard.git
cd college-resource-dashboard

# 2. Install backend dependencies
cd backend
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your configuration

# 4. Setup database
node scripts/setupDatabase.js

# 5. Install frontend dependencies
cd ../frontend
npm install

# 6. Start development servers
# Backend (in backend folder)
npm run dev

# Frontend (in frontend folder)
npm start
```

### 12.2 Production Deployment

**Recommended Platforms:**
- **Backend**: Heroku, AWS EC2, DigitalOcean
- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront
- **Database**: AWS RDS, Heroku Postgres, DigitalOcean Managed Database

**Environment Configuration:**
- Set production environment variables
- Enable HTTPS
- Configure CORS for production domain
- Set up database backups
- Implement logging and monitoring

---

## 13. Project Metrics

### 13.1 Code Statistics

- **Total Files**: ~50+
- **Lines of Code**: ~8,000+
- **Components**: 15+
- **API Endpoints**: 25+
- **Database Tables**: 3 core tables
- **Test Cases**: 20+ API tests

### 13.2 Features Implemented

- ✅ User Authentication & Authorization
- ✅ Resource CRUD Operations
- ✅ Booking System with Conflict Detection
- ✅ Admin Dashboard
- ✅ Analytics & Reporting
- ✅ Search & Filter Functionality
- ✅ Mobile Responsive Design
- ✅ Role-Based Access Control
- ✅ API Documentation
- ✅ User Guide
- ✅ Automated Testing Suite

---

## 14. Conclusion

### 14.1 Project Success Criteria

✅ **Functionality**: All core features implemented and working  
✅ **Security**: Authentication, authorization, and data protection in place  
✅ **Usability**: Intuitive UI with mobile responsiveness  
✅ **Performance**: Fast load times and responsive interactions  
✅ **Scalability**: Architecture supports future growth  
✅ **Documentation**: Comprehensive guides for users and developers  

### 14.2 Learning Outcomes

1. **Full-Stack Development** - Gained experience with React, Node.js, and PostgreSQL
2. **RESTful API Design** - Learned proper API architecture and best practices
3. **Authentication & Security** - Implemented JWT and role-based access control
4. **Database Design** - Created normalized schemas with proper relationships
5. **State Management** - Used React Context and React Query effectively
6. **Version Control** - Practiced Git workflow and collaboration
7. **Testing** - Wrote automated tests for API endpoints
8. **Documentation** - Created comprehensive technical and user documentation

### 14.3 Project Impact

The College Resource Dashboard successfully addresses the problem of resource management in educational institutions by:

- **Reducing conflicts** through automated booking validation
- **Improving accessibility** with 24/7 online access
- **Enhancing transparency** with real-time availability
- **Enabling data-driven decisions** through analytics
- **Streamlining operations** with automated workflows

This project demonstrates proficiency in modern web development practices and provides a solid foundation for real-world deployment in educational institutions.

---

## 15. References and Resources

### 15.1 Documentation

- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [PostgreSQL Manual](https://www.postgresql.org/docs/)
- [Material-UI Components](https://mui.com/)
- [JWT.io](https://jwt.io/)

### 15.2 Tools Used

- **VS Code**: Primary IDE
- **Git**: Version control
- **GitHub**: Repository hosting
- **Postman**: API testing
- **Chrome DevTools**: Frontend debugging
- **pgAdmin**: Database management

---

## 16. Appendix

### 16.1 Environment Variables

```env
# Backend Environment Variables
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=college_resource_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://localhost:3000
```

### 16.2 Default User Credentials

**Admin Account:**
- Email: admin@college.edu
- Password: admin123
- Role: Admin

### 16.3 API Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "details": { ... }
}
```

---

**Project Report Prepared By**: [Your Name]  
**Date**: October 6, 2025  
**Course**: [Your Course Name]  
**Institution**: [Your College Name]

---

**Repository**: https://github.com/xt67/college-resource-dashboard  
**Documentation**: See README.md, API_DOCUMENTATION.md, USER_GUIDE.md

