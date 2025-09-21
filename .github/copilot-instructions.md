# College Resource Dashboard - Copilot Instructions

## Project Overview
Full-stack web application with Node.js/Express backend, React frontend, and PostgreSQL/SQLite database for College Resource Usage Dashboard.

## Completed Setup Tasks

- [x] **Verify copilot-instructions.md file** - Created in .github directory
- [x] **Clarify Project Requirements** - Full-stack College Resource Usage Dashboard
- [x] **Scaffold the Project** - Backend, frontend, and database structure created
- [x] **Customize the Project** - Authentication system, API routes, and UI components implemented
- [x] **Install Required Extensions** - All necessary VS Code extensions installed
- [x] **Compile the Project** - Dependencies installed and resolved successfully
- [x] **Create and Run Task** - VS Code tasks configured for development workflow
- [x] **Launch the Project** - Both backend (port 5000) and frontend (port 3000) servers running
- [x] **Database Integration** - Automatic PostgreSQL/SQLite detection and setup completed

## Current System Status

### ✅ Completed Features
- **Authentication System**: Registration, login, logout, JWT tokens
- **Database Setup**: Auto-detects PostgreSQL, falls back to SQLite for development
- **API Foundation**: RESTful endpoints for auth, users, resources, bookings
- **Frontend Foundation**: React app with Material-UI, routing, authentication context
- **Development Environment**: VS Code tasks, hot reload, environment configuration

### 🚧 Next Development Phase
- **Resource Management**: CRUD operations for resources (Equipment, Rooms, etc.)
- **Booking System**: Resource reservation and scheduling
- **Admin Dashboard**: User management, analytics, system monitoring
- **Advanced Features**: Calendar integration, notifications, reporting

### 🧰 Technology Stack
- **Backend**: Node.js, Express.js, JWT, bcrypt, SQLite3/PostgreSQL
- **Frontend**: React, Material-UI, React Router, Chart.js, React Query
- **Database**: PostgreSQL (production) / SQLite (development)
- **Tools**: Nodemon, VS Code tasks, dotenv

### 🔧 Development Commands
- **Start Full Stack**: Use VS Code task "Start Full Stack Development"
- **Backend Only**: `cd backend && npm run dev` (http://localhost:5000)
- **Frontend Only**: `cd frontend && npm start` (http://localhost:3000)
- **Database Setup**: `cd backend && node scripts/setupDatabase.js`
- **Test Connection**: `cd backend && node scripts/setupDatabase.js test`

### 🔑 Default Credentials
- **Admin Login**: admin@college.edu
- **Password**: admin123

### 📁 Project Structure
```
college-resource-dashboard/
├── backend/                 # Node.js/Express API
│   ├── config/             # Database and app configuration
│   ├── controllers/        # Route controllers (auth, resources, etc.)
│   ├── middleware/         # Authentication and validation
│   ├── routes/             # API route definitions
│   ├── scripts/            # Database setup and utilities
│   └── server.js           # Main server file
├── frontend/               # React application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts (Auth, etc.)
│   │   ├── pages/          # Route pages (Login, Dashboard, etc.)
│   │   └── utils/          # Helper functions
└── .vscode/                # VS Code configuration
```

## Development Guidelines

### Database Development
- System automatically detects PostgreSQL availability
- Falls back to SQLite for local development if PostgreSQL unavailable
- Both databases use same API interface for seamless switching
- Admin user and sample data automatically seeded

### Authentication Flow
- JWT-based authentication with role-based access control
- Supports student, staff, and admin roles
- Protected routes and middleware implemented
- Frontend context manages auth state

### API Conventions
- RESTful endpoint structure (`/api/auth`, `/api/resources`, etc.)
- Consistent error handling and response formats
- Rate limiting and security middleware implemented
- Environment-based configuration

This project is ready for continued development of resource management features.