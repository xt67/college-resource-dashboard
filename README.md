# College Resource Dashboard

A full-stack web application for efficient college resource management, providing centralized booking and analytics for educational institutions.

## 🚀 Features

### 📋 Core Functionality
- **User Authentication**: Role-based access control (Student, Staff, Admin)
- **Resource Management**: CRUD operations for equipment and rooms
- **Booking System**: Real-time conflict detection and status management
- **Admin Dashboard**: Comprehensive analytics and user management
- **Responsive Design**: Material-UI components for modern UX

### 🎯 User Roles
- **Students**: Browse and book available resources
- **Staff**: Manage resources and moderate bookings
- **Administrators**: Full system access with analytics and user management

### 📊 Admin Dashboard Features
- Real-time analytics (users, resources, bookings)
- Popular resources tracking
- Recent activity monitoring
- User management (role assignment, department updates)
- System health monitoring
- Database status and server metrics

## 🛠 Technology Stack

### Backend
- **Node.js** with Express.js framework
- **JWT** authentication with bcrypt password hashing
- **PostgreSQL** (production) / **SQLite** (development)
- **RESTful API** design with comprehensive error handling

### Frontend
- **React** with Material-UI components
- **React Router** for client-side routing
- **React Query** for API state management
- **Context API** for authentication state

### Development Tools
- **VS Code** tasks for development workflow
- **Nodemon** for backend hot reload
- **ESLint** for code quality
- **Git** version control

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL (optional - falls back to SQLite)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/college-resource-dashboard.git
   cd college-resource-dashboard
   ```

2. **Install dependencies**
   ```bash
   # Install all dependencies (backend + frontend)
   npm run install-all
   
   # Or install separately:
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Environment setup**
   ```bash
   # Copy environment template
   cp backend/.env.example backend/.env
   
   # Edit backend/.env with your configuration
   ```

4. **Database setup**
   ```bash
   # Initialize database (auto-detects PostgreSQL, falls back to SQLite)
   cd backend && node scripts/setupDatabase.js
   ```

5. **Start development servers**
   ```bash
   # Start both backend and frontend (VS Code task)
   # Or manually:
   cd backend && npm run dev &
   cd frontend && npm start
   ```

### 🌐 Application URLs
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health

### 🔑 Default Credentials
- **Admin Login**: admin@college.edu
- **Password**: admin123

## 📁 Project Structure

```
college-resource-dashboard/
├── backend/                 # Node.js/Express API
│   ├── config/             # Database and app configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Authentication and validation
│   ├── routes/             # API route definitions
│   ├── scripts/            # Database setup and utilities
│   └── server.js           # Main server file
├── frontend/               # React application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Route pages
│   │   └── utils/          # Helper functions
└── .vscode/                # VS Code configuration
```

## 🔧 Development Commands

### Using VS Code Tasks
- **Start Full Stack**: Use VS Code task "Start Full Stack Development"
- **Install Dependencies**: Use VS Code task "Install All Dependencies"

### Manual Commands
```bash
# Backend
cd backend
npm run dev          # Start development server
npm start           # Start production server
node scripts/setupDatabase.js  # Setup database

# Frontend
cd frontend
npm start           # Start development server
npm run build       # Build for production
npm test            # Run tests
```

## 🗄 Database Schema

### Tables
- **users**: User authentication and profiles
- **resources**: Equipment and room inventory
- **bookings**: Resource reservations and scheduling

### Features
- Automatic PostgreSQL detection
- SQLite fallback for development
- Database migrations and seeding
- Multi-database support with consistent API

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Resources
- `GET /api/resources` - List all resources
- `POST /api/resources` - Create new resource
- `PUT /api/resources/:id` - Update resource
- `DELETE /api/resources/:id` - Delete resource
- `GET /api/resources/types` - Get resource types
- `GET /api/resources/locations` - Get locations

### Bookings
- `GET /api/bookings` - List user bookings
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

### Admin (Admin only)
- `GET /api/admin/analytics` - System analytics
- `GET /api/admin/users` - User management
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/health` - System health

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- SQL injection prevention
- CORS configuration

## 🎨 UI/UX Features

- Material-UI design system
- Responsive layout for mobile/desktop
- Real-time status updates
- Intuitive navigation
- Accessible components
- Dark/light theme support

## 🚀 Deployment

### Environment Variables
```env
# Backend (.env)
NODE_ENV=production
PORT=5000
JWT_SECRET=your_jwt_secret_here
DATABASE_URL=postgresql://user:pass@host:port/dbname

# Frontend
REACT_APP_API_URL=https://your-api-domain.com
```

### Production Setup
1. Build frontend: `npm run build`
2. Configure environment variables
3. Setup PostgreSQL database
4. Deploy backend to your hosting platform
5. Deploy frontend build to static hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Material-UI for the component library
- React community for excellent documentation
- Node.js and Express.js teams for the robust backend framework

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ for educational institutions**