# College Resource Dashboard API Documentation

## Base URL
`http://localhost:5000/api`

## Authentication
The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <token>
```

## Error Responses
All endpoints return errors in the following format:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information (development only)"
}
```

## Success Responses
All endpoints return success responses in the following format:
```json
{
  "success": true,
  "message": "Success message",
  "data": {} // Response data
}
```

---

## Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required, valid email)",
  "password": "string (required, min 6 characters)",
  "role": "string (optional, default: 'student')",
  "department": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@college.edu",
    "role": "student"
  }
}
```

### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@college.edu",
    "role": "student"
  }
}
```

### POST /auth/logout
Logout current user (invalidates token).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## Resources Endpoints

### GET /resources
Get all resources with optional filtering.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `type` (optional): Filter by resource type
- `location` (optional): Filter by location
- `available` (optional): Filter available resources only (true/false)
- `search` (optional): Search in name, description, location

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Conference Room A",
      "type": "Room",
      "description": "Large conference room with projector",
      "location": "Building 1, Floor 2",
      "capacity": 20,
      "available_count": 1,
      "status": "available",
      "created_at": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

### GET /resources/:id
Get a specific resource by ID.

**Headers:** `Authorization: Bearer <token>`

**Response:** Same as GET /resources but returns single object.

### POST /resources
Create a new resource (Admin/Staff only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "string (required)",
  "type": "string (required)",
  "description": "string (optional)",
  "location": "string (required)",
  "capacity": "number (required, min 1)",
  "available_count": "number (required, min 0)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Resource created successfully",
  "data": {
    "id": 1,
    "name": "Conference Room A",
    "type": "Room",
    "description": "Large conference room with projector",
    "location": "Building 1, Floor 2",
    "capacity": 20,
    "available_count": 1,
    "status": "available"
  }
}
```

### PUT /resources/:id
Update an existing resource (Admin/Staff only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:** Same as POST /resources

**Response:** Same as POST /resources

### DELETE /resources/:id
Delete a resource (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Resource deleted successfully"
}
```

### GET /resources/types
Get all unique resource types.

**Response:**
```json
{
  "success": true,
  "data": ["Room", "Equipment", "Vehicle"]
}
```

### GET /resources/locations
Get all unique resource locations.

**Response:**
```json
{
  "success": true,
  "data": ["Building 1, Floor 2", "Lab Building", "Library"]
}
```

---

## Bookings Endpoints

### GET /bookings
Get current user's bookings.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status` (optional): Filter by booking status
- `resource_id` (optional): Filter by resource ID
- `start_date` (optional): Filter bookings from date
- `end_date` (optional): Filter bookings until date

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "resource_id": 1,
      "resource_name": "Conference Room A",
      "user_id": 1,
      "start_time": "2023-12-01T09:00:00.000Z",
      "end_time": "2023-12-01T10:00:00.000Z",
      "purpose": "Team meeting",
      "status": "confirmed",
      "created_at": "2023-11-30T12:00:00.000Z"
    }
  ]
}
```

### POST /bookings
Create a new booking.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "resource_id": "number (required)",
  "start_time": "string (required, ISO date)",
  "end_time": "string (required, ISO date)",
  "purpose": "string (required)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": 1,
    "resource_id": 1,
    "user_id": 1,
    "start_time": "2023-12-01T09:00:00.000Z",
    "end_time": "2023-12-01T10:00:00.000Z",
    "purpose": "Team meeting",
    "status": "pending"
  }
}
```

### PUT /bookings/:id
Update a booking (own bookings or Admin/Staff).

**Headers:** `Authorization: Bearer <token>`

**Request Body:** Same as POST /bookings

**Response:** Same as POST /bookings

### DELETE /bookings/:id
Cancel a booking (own bookings or Admin/Staff).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Booking cancelled successfully"
}
```

### GET /bookings/:id/conflicts
Check for booking conflicts for a specific time slot.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `start_time` (required): ISO date string
- `end_time` (required): ISO date string
- `resource_id` (required): Resource ID

**Response:**
```json
{
  "success": true,
  "data": {
    "hasConflict": false,
    "conflicts": []
  }
}
```

---

## Admin Endpoints
(Admin role required for all endpoints)

### GET /admin/analytics
Get comprehensive system analytics.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `timeRange` (optional): Filter by time range (1d, 7d, 30d, 90d)

**Response:**
```json
{
  "success": true,
  "data": {
    "userStats": {
      "total_users": 150,
      "students": 120,
      "staff": 25,
      "admins": 5
    },
    "resourceStats": {
      "total_resources": 50,
      "available_resources": 45,
      "total_capacity": 500,
      "total_available": 450
    },
    "bookingStats": {
      "total_bookings": 1200,
      "pending_bookings": 25,
      "confirmed_bookings": 1100,
      "cancelled_bookings": 75
    },
    "bookingTrends": [
      {
        "date": "2023-11-25",
        "bookings_count": 45
      }
    ],
    "popularResources": [
      {
        "id": 1,
        "name": "Conference Room A",
        "type": "Room",
        "location": "Building 1",
        "booking_count": 150
      }
    ],
    "recentActivity": [
      {
        "id": 1,
        "user_name": "John Doe",
        "resource_name": "Conference Room A",
        "status": "confirmed",
        "created_at": "2023-11-30T12:00:00.000Z"
      }
    ]
  }
}
```

### GET /admin/users
Get all users in the system.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@college.edu",
      "role": "student",
      "department": "Computer Science",
      "created_at": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

### PUT /admin/users/:id
Update user information (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "role": "string (optional)",
  "department": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@college.edu",
    "role": "staff",
    "department": "Computer Science"
  }
}
```

### DELETE /admin/users/:id
Delete a user (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### GET /admin/health
Get system health information.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "database": {
      "status": "healthy",
      "type": "SQLite",
      "queryTime": "2ms"
    },
    "server": {
      "uptime": 86400,
      "nodeVersion": "v18.17.0",
      "platform": "linux",
      "memory": {
        "heapUsed": 50331648,
        "heapTotal": 67108864
      }
    }
  }
}
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Invalid or missing authentication |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource conflict (e.g., booking overlap) |
| 422 | Unprocessable Entity - Validation errors |
| 500 | Internal Server Error - Server error |

---

## Rate Limiting

The API implements rate limiting to prevent abuse:
- 100 requests per 15 minutes per IP address
- Additional limits may apply to specific endpoints

---

## Example Usage

### JavaScript/Fetch
```javascript
// Login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@college.edu',
    password: 'password123'
  })
});

const { token } = await loginResponse.json();

// Get resources
const resourcesResponse = await fetch('/api/resources', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const resources = await resourcesResponse.json();
```

### cURL
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@college.edu","password":"password123"}'

# Get resources (replace TOKEN with actual token)
curl -X GET http://localhost:5000/api/resources \
  -H "Authorization: Bearer TOKEN"

# Create booking
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "resource_id": 1,
    "start_time": "2023-12-01T09:00:00.000Z",
    "end_time": "2023-12-01T10:00:00.000Z",
    "purpose": "Team meeting"
  }'
```