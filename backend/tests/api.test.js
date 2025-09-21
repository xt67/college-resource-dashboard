const request = require('supertest');
const app = require('../server');

describe('Authentication API', () => {
  let adminToken;
  let userToken;

  beforeAll(async () => {
    // Login as admin to get token for authenticated tests
    const adminResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@college.edu',
        password: 'admin123'
      });
    
    adminToken = adminResponse.body.token;

    // Create a test user and get token
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@college.edu',
        password: 'test123',
        role: 'student'
      });
    
    if (userResponse.status === 201) {
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@college.edu',
          password: 'test123'
        });
      userToken = loginResponse.body.token;
    }
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user with valid data', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'New User',
          email: 'newuser@college.edu',
          password: 'password123',
          role: 'student'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User registered successfully');
    });

    it('should return error for duplicate email', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'First User',
          email: 'duplicate@college.edu',
          password: 'password123',
          role: 'student'
        });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Second User',
          email: 'duplicate@college.edu',
          password: 'password123',
          role: 'student'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return error for invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Invalid Email User',
          email: 'invalid-email',
          password: 'password123',
          role: 'student'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@college.edu',
          password: 'admin123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe('admin@college.edu');
    });

    it('should return error for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@college.edu',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should return error for non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@college.edu',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});

describe('Resources API', () => {
  let adminToken;

  beforeAll(async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@college.edu',
        password: 'admin123'
      });
    adminToken = response.body.token;
  });

  describe('GET /api/resources', () => {
    it('should get all resources', async () => {
      const response = await request(app)
        .get('/api/resources')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter resources by type', async () => {
      const response = await request(app)
        .get('/api/resources?type=Equipment')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      
      if (response.body.data.length > 0) {
        response.body.data.forEach(resource => {
          expect(resource.type).toBe('Equipment');
        });
      }
    });
  });

  describe('POST /api/resources', () => {
    it('should create a new resource with admin privileges', async () => {
      const resourceData = {
        name: 'Test Projector',
        type: 'Equipment',
        description: 'HD projector for presentations',
        location: 'Room 101',
        capacity: 1,
        available_count: 1
      };

      const response = await request(app)
        .post('/api/resources')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(resourceData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(resourceData.name);
    });

    it('should return error without authentication', async () => {
      const resourceData = {
        name: 'Unauthorized Resource',
        type: 'Equipment',
        description: 'Should not be created',
        location: 'Room 101',
        capacity: 1,
        available_count: 1
      };

      const response = await request(app)
        .post('/api/resources')
        .send(resourceData);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});

describe('Bookings API', () => {
  let userToken;
  let resourceId;

  beforeAll(async () => {
    // Get user token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@college.edu',
        password: 'admin123'
      });
    userToken = loginResponse.body.token;

    // Get first available resource
    const resourceResponse = await request(app)
      .get('/api/resources')
      .set('Authorization', `Bearer ${userToken}`);
    
    if (resourceResponse.body.data.length > 0) {
      resourceId = resourceResponse.body.data[0].id;
    }
  });

  describe('POST /api/bookings', () => {
    it('should create a new booking', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);

      const endTime = new Date(tomorrow);
      endTime.setHours(11, 0, 0, 0);

      const bookingData = {
        resource_id: resourceId,
        start_time: tomorrow.toISOString(),
        end_time: endTime.toISOString(),
        purpose: 'Test booking'
      };

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .send(bookingData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.purpose).toBe(bookingData.purpose);
    });

    it('should return error for invalid time range', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const bookingData = {
        resource_id: resourceId,
        start_time: yesterday.toISOString(),
        end_time: new Date().toISOString(),
        purpose: 'Invalid booking'
      };

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .send(bookingData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/bookings', () => {
    it('should get user bookings', async () => {
      const response = await request(app)
        .get('/api/bookings')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
});

describe('Admin API', () => {
  let adminToken;

  beforeAll(async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@college.edu',
        password: 'admin123'
      });
    adminToken = response.body.token;
  });

  describe('GET /api/admin/analytics', () => {
    it('should get analytics data for admin', async () => {
      const response = await request(app)
        .get('/api/admin/analytics')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.userStats).toBeDefined();
      expect(response.body.data.resourceStats).toBeDefined();
      expect(response.body.data.bookingStats).toBeDefined();
    });
  });

  describe('GET /api/admin/users', () => {
    it('should get all users for admin', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/admin/health', () => {
    it('should get system health data', async () => {
      const response = await request(app)
        .get('/api/admin/health')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.database).toBeDefined();
      expect(response.body.data.server).toBeDefined();
    });
  });
});

module.exports = app;