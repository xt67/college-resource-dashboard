# Database Setup Guide

## Option 1: PostgreSQL Installation (Recommended for Production)

### Windows Installation:
1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Run the installer and follow setup wizard
3. Remember the password you set for the `postgres` user
4. Default port is 5432

### Configuration:
1. Update your `.env` file in the backend folder:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=college_resource_db
DB_USER=postgres
DB_PASSWORD=your_password_here
```

2. Run database setup:
```bash
cd backend
npm run db:setup
```

## Option 2: Docker PostgreSQL (Alternative)

If you have Docker installed:

```bash
# Run PostgreSQL in Docker
docker run --name college-db -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:13

# Update .env file with:
DB_PASSWORD=password
```

## Option 3: SQLite for Development (Quick Start)

For quick development without PostgreSQL setup, we can use SQLite:

1. The system will automatically detect if PostgreSQL is unavailable
2. Switch to SQLite for local development
3. Database file will be created automatically

## Testing Your Setup

After configuring PostgreSQL:

```bash
cd backend
npm run db:test    # Test connection
npm run db:setup   # Create database and tables
npm start          # Start server
```

## Default Admin Account

After successful database setup, you can login with:
- Email: admin@college.edu
- Password: admin123

**⚠️ Change this password immediately after first login!**

## Troubleshooting

### Common Issues:
1. **Connection refused**: PostgreSQL service not running
2. **Authentication failed**: Wrong password in .env file
3. **Database not found**: Run `npm run db:setup` first

### Solutions:
- Windows: Check Services for PostgreSQL service
- Verify .env file has correct credentials
- Ensure PostgreSQL is listening on port 5432