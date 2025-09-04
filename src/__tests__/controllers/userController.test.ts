// src/__tests__/controllers/userController.test.ts
import { Response } from 'express';
import * as userController from '../../controllers/userController';
import { database } from '../../database';
import * as helper from '../../utils/helper';
import { IRequestUser } from '../../Middleware/authMiddleware';

// Mock dependencies
jest.mock('../../database', () => ({
  database: {
    User: {
      findAll: jest.fn(),
      findOne: jest.fn(),
      findByPk: jest.fn(),
      create: jest.fn(),
    },
    Role: {
      findOne: jest.fn(),
    },
  },
}));
jest.mock('../../utils/helper', () => ({
  hashPassword: jest.fn(),
  comparePassword: jest.fn(),
  generateToken: jest.fn(),
  destroyToken: jest.fn(),
}));

// Extend the request type for tests
type MockRequest = Partial<IRequestUser> & { token?: string };
type MockResponse = Partial<Response>;

describe('UserController', () => {
  let mockRequest: MockRequest;
  let mockResponse: MockResponse;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {
      body: {},
      params: {},
      user: { id: '1', role: 'Admin' },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('getAllUsers', () => {
    it('should return users when found', async () => {
      (database.User.findAll as jest.Mock).mockResolvedValue([{ id: '1', email: 'test@example.com' }]);

      await userController.getAllUsers(mockRequest as any, mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should return 404 if no users', async () => {
      (database.User.findAll as jest.Mock).mockResolvedValue([]);

      await userController.getAllUsers(mockRequest as any, mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      (database.User.findOne as jest.Mock).mockResolvedValue(null);
      (database.Role.findOne as jest.Mock).mockResolvedValue({ id: 'role-id', name: 'Employee' });
      (helper.hashPassword as jest.Mock).mockResolvedValue('hashedPass');
      (database.User.create as jest.Mock).mockResolvedValue({
        id: '1',
        fullName: 'John Doe',
        email: 'john@example.com',
        role: 'Employee',
        department: 'IT',
      });

      mockRequest.body = {
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'password',
        role: 'Employee',
      };

      await userController.createUser(mockRequest as any, mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });

    it('should return 409 if user exists', async () => {
      (database.User.findOne as jest.Mock).mockResolvedValue({ id: 'existing' });

      mockRequest.body = { email: 'test@example.com', password: '123', role: 'Employee', fullName: 'Test' };

      await userController.createUser(mockRequest as any, mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledWith(409);
    });

    it('should return 400 if role is invalid', async () => {
      (database.User.findOne as jest.Mock).mockResolvedValue(null);
      (database.Role.findOne as jest.Mock).mockResolvedValue(null);

      mockRequest.body = { email: 'new@example.com', password: '123', role: 'Invalid', fullName: 'Test' };

      await userController.createUser(mockRequest as any, mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });

  describe('loginUser', () => {
    it('should login successfully', async () => {
      (database.User.findOne as jest.Mock).mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        password: 'hashed',
        isActive: true,
        role: 'Employee',
      });
      (helper.comparePassword as jest.Mock).mockResolvedValue(true);
      (helper.generateToken as jest.Mock).mockResolvedValue('token123');

      mockRequest.body = { email: 'test@example.com', password: 'password123' };

      await userController.loginUser(mockRequest as any, mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should return 404 if user not found', async () => {
      (database.User.findOne as jest.Mock).mockResolvedValue(null);

      mockRequest.body = { email: 'test@example.com', password: 'password123' };

      await userController.loginUser(mockRequest as any, mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });

    it('should return 403 if user inactive', async () => {
      (database.User.findOne as jest.Mock).mockResolvedValue({ isActive: false });

      mockRequest.body = { email: 'test@example.com', password: 'password123' };

      await userController.loginUser(mockRequest as any, mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
    });

    it('should return 401 if password invalid', async () => {
      (database.User.findOne as jest.Mock).mockResolvedValue({ password: 'hashed', isActive: true });
      (helper.comparePassword as jest.Mock).mockResolvedValue(false);

      mockRequest.body = { email: 'test@example.com', password: 'wrong' };

      await userController.loginUser(mockRequest as any, mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });
  });

  describe('getUserProfile', () => {
    it('should return profile if authenticated', async () => {
      (database.User.findByPk as jest.Mock).mockResolvedValue({ id: '1', email: 'test@example.com' });

      await userController.getUserProfile(mockRequest as any, mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should return 401 if not authenticated', async () => {
      mockRequest.user = undefined;

      await userController.getUserProfile(mockRequest as any, mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });

    it('should return 404 if user not found', async () => {
      (database.User.findByPk as jest.Mock).mockResolvedValue(null);

      await userController.getUserProfile(mockRequest as any, mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
  });

  describe('updatePassword', () => {
    it('should update password successfully', async () => {
      const mockUser = { password: 'old', update: jest.fn() };
      (database.User.findByPk as jest.Mock).mockResolvedValue(mockUser);
      (helper.comparePassword as jest.Mock).mockResolvedValue(true);
      (helper.hashPassword as jest.Mock).mockResolvedValue('newHashed');

      mockRequest.body = { currentPassword: 'old', newPassword: 'newPass' };

      await userController.updatePassword(mockRequest as any, mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should return 401 if not authenticated', async () => {
      mockRequest.user = undefined;

      await userController.updatePassword(mockRequest as any, mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });

    it('should return 404 if user not found', async () => {
      (database.User.findByPk as jest.Mock).mockResolvedValue(null);

      await userController.updatePassword(mockRequest as any, mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });

    it('should return 401 if current password invalid', async () => {
      (database.User.findByPk as jest.Mock).mockResolvedValue({ password: 'hashed' });
      (helper.comparePassword as jest.Mock).mockResolvedValue(false);

      mockRequest.body = { currentPassword: 'wrong', newPassword: 'new' };

      await userController.updatePassword(mockRequest as any, mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });
  });

  describe('logoutUser', () => {
    it('should logout successfully', async () => {
      (helper.destroyToken as jest.Mock).mockResolvedValue(true);
      mockRequest.token = 'token123';

      await userController.logoutUser(mockRequest as any, mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should return 500 if destroyToken fails', async () => {
      (helper.destroyToken as jest.Mock).mockRejectedValue(new Error('fail'));
      mockRequest.token = 'token123';

      await userController.logoutUser(mockRequest as any, mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });
});
