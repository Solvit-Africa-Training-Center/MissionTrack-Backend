// import request from 'supertest';
// import { app } from '../index';
// import { database } from '../database';
// import { hashPassword } from '../utils/helper';

// describe('Authentication System', () => {
//   let adminToken: string;
//   let employeeToken: string;
//   let testUserId: string;

//   beforeAll(async () => {
//     // Connect to test database
//     await database.sequelize.sync({ force: true });
    
//     // Create test admin user
//     const adminPassword = await hashPassword('admin123');
//     const adminUser = await database.User.create({
//       fullName: 'Admin User',
//       email: 'admin@test.com',
//       password: adminPassword,
//       role: 'Admin',
//       department: 'IT',
//     });

//     // Login as admin
//     const adminResponse = await request(app)
//       .post('/api/users/login')
//       .send({
//         email: 'admin@test.com',
//         password: 'admin123',
//       });

//     adminToken = adminResponse.body.data.token;
//   });

//   afterAll(async () => {
//     await database.sequelize.close();
//   });

//   describe('POST /api/users/login', () => {
//     it('should login successfully with valid credentials', async () => {
//       const response = await request(app)
//         .post('/api/users/login')
//         .send({
//           email: 'admin@test.com',
//           password: 'admin123',
//         });

//       expect(response.status).toBe(200);
//       expect(response.body.success).toBe(true);
//       expect(response.body.data.token).toBeDefined();
//       expect(response.body.data.user.email).toBe('admin@test.com');
//     });

//     it('should fail with invalid credentials', async () => {
//       const response = await request(app)
//         .post('/api/users/login')
//         .send({
//           email: 'admin@test.com',
//           password: 'wrongpassword',
//         });

//       expect(response.status).toBe(401);
//       expect(response.body.success).toBe(false);
//     });

//     it('should validate required fields', async () => {
//       const response = await request(app)
//         .post('/api/users/login')
//         .send({
//           email: 'invalid-email',
//         });

//       expect(response.status).toBe(400);
//       expect(response.body.success).toBe(false);
//     });
//   });

//   describe('POST /api/users (Admin Only)', () => {
//     it('should create a new user when admin is authenticated', async () => {
//       const response = await request(app)
//         .post('/api/users')
//         .set('Authorization', `Bearer ${adminToken}`)
//         .send({
//           fullName: 'Test Employee',
//           email: 'employee@test.com',
//           password: 'password123',
//           role: 'Employee',
//           department: 'Engineering',
//         });

//       expect(response.status).toBe(201);
//       expect(response.body.success).toBe(true);
//       expect(response.body.data.email).toBe('employee@test.com');
      
//       testUserId = response.body.data.id;
//     });

//     it('should fail when non-admin tries to create user', async () => {
//       // First create an employee user
//       const employeeUser = await database.User.create({
//         fullName: 'Employee User',
//         email: 'employee2@test.com',
//         password: await hashPassword('password123'),
//         role: 'Employee',
//       });

//       // Login as employee
//       const loginResponse = await request(app)
//         .post('/api/users/login')
//         .send({
//           email: 'employee2@test.com',
//           password: 'password123',
//         });

//       const employeeToken = loginResponse.body.data.token;

//       // Try to create user as employee
//       const response = await request(app)
//         .post('/api/users')
//         .set('Authorization', `Bearer ${employeeToken}`)
//         .send({
//           fullName: 'Another User',
//           email: 'another@test.com',
//           password: 'password123',
//           role: 'Employee',
//         });

//       expect(response.status).toBe(403);
//       expect(response.body.success).toBe(false);
//     });
//   });

//   describe('GET /api/users/profile', () => {
//     it('should return user profile when authenticated', async () => {
//       const response = await request(app)
//         .get('/api/users/profile')
//         .set('Authorization', `Bearer ${adminToken}`);

//       expect(response.status).toBe(200);
//       expect(response.body.success).toBe(true);
//       expect(response.body.data.user.email).toBe('admin@test.com');
//     });

//     it('should fail without authentication token', async () => {
//       const response = await request(app)
//         .get('/api/users/profile');

//       expect(response.status).toBe(401);
//       expect(response.body.success).toBe(false);
//     });
//   });

//   describe('PUT /api/users/password', () => {
//     it('should update password when current password is correct', async () => {
//       const response = await request(app)
//         .put('/api/users/password')
//         .set('Authorization', `Bearer ${adminToken}`)
//         .send({
//           currentPassword: 'admin123',
//           newPassword: 'newpassword123',
//         });

//       expect(response.status).toBe(200);
//       expect(response.body.success).toBe(true);
//     });

//     it('should fail with incorrect current password', async () => {
//       const response = await request(app)
//         .put('/api/users/password')
//         .set('Authorization', `Bearer ${adminToken}`)
//         .send({
//           currentPassword: 'wrongpassword',
//           newPassword: 'newpassword123',
//         });

//       expect(response.status).toBe(401);
//       expect(response.body.success).toBe(false);
//     });
//   });

//   describe('POST /api/users/logout', () => {
//     it('should logout successfully', async () => {
//       const response = await request(app)
//         .post('/api/users/logout')
//         .set('Authorization', `Bearer ${adminToken}`);

//       expect(response.status).toBe(200);
//       expect(response.body.success).toBe(true);
//     });
//   });

//   describe('GET /api/users (Admin Only)', () => {
//     it('should return all users when admin is authenticated', async () => {
//       const response = await request(app)
//         .get('/api/users')
//         .set('Authorization', `Bearer ${adminToken}`);

//       expect(response.status).toBe(200);
//       expect(response.body.success).toBe(true);
//       expect(Array.isArray(response.body.data.users)).toBe(true);
//     });
//   });
// });

