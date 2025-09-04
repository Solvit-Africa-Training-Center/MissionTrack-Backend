// src/__tests__/unit/middlewares/validationMiddleware.test.ts

import { Request, Response, NextFunction } from 'express';
import { validateLogin, validateCreateUser, validateUpdatePassword } from '../../Middleware/validationMiddleware';

describe('ValidationMiddleware Unit Tests', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    responseJson = jest.fn();
    responseStatus = jest.fn().mockReturnValue({ json: responseJson });
    mockNext = jest.fn();

    mockRequest = {
      body: {},
    };

    mockResponse = {
      status: responseStatus,
      json: responseJson,
    };

    jest.clearAllMocks();
  });

  describe('validateLogin', () => {
    it('should call next() with valid login data', () => {
      mockRequest.body = {
        email: 'test@example.com',
        password: 'password123',
      };

      validateLogin(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 400 for invalid email', () => {
      mockRequest.body = {
        email: 'invalid-email',
        password: 'password123',
      };

      validateLogin(mockRequest as Request, mockResponse as Response, mockNext);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        status: 400,
        message: 'Please provide a valid email address',
        data: null,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 400 for short password', () => {
      mockRequest.body = {
        email: 'test@example.com',
        password: '123',
      };

      validateLogin(mockRequest as Request, mockResponse as Response, mockNext);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        status: 400,
        message: 'Password must be at least 6 characters long',
        data: null,
      });
    });

    it('should return 400 for missing email', () => {
      mockRequest.body = {
        password: 'password123',
      };

      validateLogin(mockRequest as Request, mockResponse as Response, mockNext);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        status: 400,
        message: 'Email is required',
        data: null,
      });
    });

    it('should return 400 for missing password', () => {
      mockRequest.body = {
        email: 'test@example.com',
      };

      validateLogin(mockRequest as Request, mockResponse as Response, mockNext);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        status: 400,
        message: 'Password is required',
        data: null,
      });
    });
  });

  describe('validateCreateUser', () => {
    const validUserData = {
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'Employee',
    };

    it('should call next() with valid user data', () => {
      mockRequest.body = validUserData;

      validateCreateUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 400 for missing fullName', () => {
      mockRequest.body = {
        ...validUserData,
        fullName: '',
      };

      validateCreateUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 400 for invalid role', () => {
      mockRequest.body = {
        ...validUserData,
        role: 'InvalidRole',
      };

      validateCreateUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        status: 400,
        message: 'Role must be one of: Employee, Manager, Finance, Admin',
        data: null,
      });
    });

    it('should return 400 for invalid email format', () => {
      mockRequest.body = {
        ...validUserData,
        email: 'invalid-email',
      };

      validateCreateUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        status: 400,
        message: 'Please provide a valid email address',
        data: null,
      });
    });

    it('should return 400 for short password', () => {
      mockRequest.body = {
        ...validUserData,
        password: '123',
      };

      validateCreateUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        status: 400,
        message: 'Password must be at least 6 characters long',
        data: null,
      });
    });

    it('should accept optional fields', () => {
      mockRequest.body = {
        ...validUserData,
        department: 'Engineering',
        phone: '+250780000001',
        isActive: true,
      };

      validateCreateUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });
});