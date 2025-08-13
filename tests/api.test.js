const request = require('supertest');
const app = require('../src/app');

describe('API Endpoints', () => {
  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);
      
      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('User API', () => {
    describe('GET /api/users', () => {
      it('should return all users', async () => {
        const response = await request(app)
          .get('/api/users')
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.count).toBeGreaterThanOrEqual(0);
      });
    });

    describe('POST /api/users', () => {
      it('should create a new user', async () => {
        const newUser = {
          name: 'Test User',
          email: 'test@example.com'
        };
        
        const response = await request(app)
          .post('/api/users')
          .send(newUser)
          .expect(201);
        
        expect(response.body.success).toBe(true);
        expect(response.body.data.name).toBe(newUser.name);
        expect(response.body.data.email).toBe(newUser.email);
        expect(response.body.data).toHaveProperty('id');
      });

      it('should return error for missing fields', async () => {
        const response = await request(app)
          .post('/api/users')
          .send({ name: 'Test User' }) // Missing email
          .expect(400);
        
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('Name and email are required');
      });
    });

    describe('GET /api/users/:id', () => {
      it('should return 404 for non-existent user', async () => {
        const response = await request(app)
          .get('/api/users/999')
          .expect(404);
        
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('User not found');
      });
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/unknown-route')
        .expect(404);
      
      expect(response.body.error).toBe('Route not found');
    });
  });
});