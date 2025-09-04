// src/__tests__/unit/middlewares/authMiddleware.test.ts

import { Response, NextFunction } from 'express';
import { authMiddleware, checkRole, IRequestUser } from '../../Middleware/authMiddleware';
import { verifyToken } from '../../utils/helper';

jest.mock('../../utils/helper');

const mockVerifyToken = verifyToken as jest.MockedFunction<typeof verifyToken>;

describe('AuthMiddleware Unit Tests', () => {
  let mockRequest: Partial<IRequestUser>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    responseJson = jest.fn();
    responseStatus = jest.fn().mockReturnValue({ json: responseJson });
    mockNext = jest.fn();

    mockRequest = {
      headers: {},
      user: undefined,
      token: undefined,
    };

    mockResponse = {
      status: responseStatus,
      json: responseJson,
    };

    jest.clearAllMocks();
  });

  describe('authMiddleware', () => {
    it('should call next() with valid token', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        role: 'Employee' as const,
      };

      mockRequest.headers = {
        authorization: 'Bearer valid-token-123',
      };

      mockVerifyToken.mockResolvedValue(mockUser);

      await authMiddleware(mockRequest as IRequestUser, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRequest.user).toEqual(mockUser);
      expect(mockRequest.token).toBe('valid-token-123');
    });

    it('should return 401 when no token provided', async () => {
      mockRequest.headers = {};

      await authMiddleware(mockRequest as IRequestUser, mockResponse as Response, mockNext);

      expect(responseStatus).toHaveBeenCalledWith(401);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        status: 401,
        message: 'Authentication token is missing',
        data: null,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when token is invalid', async () => {
      mockRequest.headers = {
        authorization: 'Bearer invalid-token',
      };

      mockVerifyToken.mockResolvedValue(null);

      await authMiddleware(mockRequest as IRequestUser, mockResponse as Response, mockNext);

      expect(responseStatus).toHaveBeenCalledWith(401);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        status: 401,
        message: 'Invalid authentication token',
        data: null,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('checkRole', () => {
    beforeEach(() => {
      mockRequest.user = {
        id: 'user-id',
        email: 'test@example.com',
        role: 'Employee',
      };
    });

    it('should call next() when user has required role', async () => {
      const roleCheckMiddleware = checkRole(['Employee', 'Manager']);

      await roleCheckMiddleware(mockRequest as IRequestUser, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 403 when user does not have required role', async () => {
      const roleCheckMiddleware = checkRole(['Admin']);

      await roleCheckMiddleware(mockRequest as IRequestUser, mockResponse as Response, mockNext);

      expect(responseStatus).toHaveBeenCalledWith(403);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        status: 403,
        message: 'You do not have the required role to perform this action',
        data: null,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 when role information is missing', async () => {
      mockRequest.user = { id: 'user-id', email: 'test@example.com' } as any;
      
      const roleCheckMiddleware = checkRole(['Employee']);

      await roleCheckMiddleware(mockRequest as IRequestUser, mockResponse as Response, mockNext);

      expect(responseStatus).toHaveBeenCalledWith(403);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        status: 403,
        message: 'Role information is missing',
        data: null,
      });
    });
  });
});