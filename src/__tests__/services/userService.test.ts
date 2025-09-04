import { UserService } from '../../services/userService';
import { database } from '../../database';
import { hashPassword, comparePassword } from '../../utils/helper';

jest.mock('../../database');
jest.mock('../../utils/helper');

const mockHashPassword = hashPassword as jest.MockedFunction<typeof hashPassword>;
const mockComparePassword = comparePassword as jest.MockedFunction<typeof comparePassword>;

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    jest.clearAllMocks();
  });

  // ---------------- LOGIN ----------------
  describe('login', () => {
    const loginCredentials = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should return user data on successful login', async () => {
      const mockUser = {
        id: 'user-id',
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'Employee',
        department: 'Engineering',
        phone: '+250780000001',
        isActive: true,
      };

      (database.User.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockUser);
      mockComparePassword.mockResolvedValue(true);

      const result = await userService.login(loginCredentials);

      expect(result).toEqual({
        id: mockUser.id,
        fullName: mockUser.fullName,
        email: mockUser.email,
        role: mockUser.role,
        department: mockUser.department,
        phone: mockUser.phone,
      });
    });

    it('should throw error when user not found', async () => {
      (database.User.findOne as jest.Mock) = jest.fn().mockResolvedValue(null);

      await expect(userService.login(loginCredentials)).rejects.toThrow('Invalid email or password');
    });

    it('should throw error when user is not active', async () => {
      const inactiveUser = {
        id: 'user-id',
        email: 'test@example.com',
        isActive: false,
      };

      (database.User.findOne as jest.Mock) = jest.fn().mockResolvedValue(inactiveUser);

      await expect(userService.login(loginCredentials)).rejects.toThrow(
        'Account is deactivated. Please contact administrator.'
      );
    });

    it('should throw error when password is invalid', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        password: 'hashedPassword',
        isActive: true,
      };

      (database.User.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockUser);
      mockComparePassword.mockResolvedValue(false);

      await expect(userService.login(loginCredentials)).rejects.toThrow('Invalid email or password');
    });

    it('should successfully authenticate user', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        isActive: true,
      };

      (database.User.findOne as jest.Mock).mockResolvedValueOnce(mockUser);
      (comparePassword as jest.Mock).mockResolvedValueOnce(true);

      const result = await userService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toBeDefined();
      expect(result.id).toBe(mockUser.id);
    });
  });

  // ---------------- CREATE USER ----------------
  describe('createUser', () => {
    const userData = {
      fullName: 'New User',
      email: 'newuser@example.com',
      password: 'password123',
      role: 'Employee' as const,
      department: 'Engineering',
    };

    it('should create user successfully', async () => {
      const mockRole = {
        id: 'role-id',
        name: 'Employee',
        isActive: true,
      };

      const mockCreatedUser = {
        id: 'new-user-id',
        ...userData,
        roleId: 'role-id',
        password: 'hashedPassword',
        phone: undefined,
      };

      (database.User.findOne as jest.Mock) = jest.fn().mockResolvedValue(null);
      (database.Role.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockRole);
      (database.User.create as jest.Mock) = jest.fn().mockResolvedValue(mockCreatedUser);
      mockHashPassword.mockResolvedValue('hashedPassword');

      const result = await userService.createUser(userData);

      expect(result).toEqual({
        id: mockCreatedUser.id,
        fullName: mockCreatedUser.fullName,
        email: mockCreatedUser.email,
        role: mockCreatedUser.role,
        department: mockCreatedUser.department,
        phone: mockCreatedUser.phone,
      });
    });

    it('should throw error when user already exists', async () => {
      const existingUser = { id: 'existing-id', email: userData.email };

      (database.User.findOne as jest.Mock) = jest.fn().mockResolvedValue(existingUser);

      await expect(userService.createUser(userData)).rejects.toThrow('User already exists');
    });

    it('should throw error when role is invalid', async () => {
      (database.User.findOne as jest.Mock) = jest.fn().mockResolvedValue(null);
      (database.Role.findOne as jest.Mock) = jest.fn().mockResolvedValue(null);

      await expect(userService.createUser(userData)).rejects.toThrow(`Invalid role: ${userData.role}`);
    });

    it('should create a new user', async () => {
      const mockRole = { id: '1', name: 'Employee' };
      const mockUser = {
        id: '1',
        email: 'new@example.com',
        fullName: 'Test User',
      };

      (database.Role.findOne as jest.Mock).mockResolvedValueOnce(mockRole);
      (database.User.findOne as jest.Mock).mockResolvedValueOnce(null);
      (database.User.create as jest.Mock) = jest.fn().mockResolvedValue(mockUser);
      (hashPassword as jest.Mock).mockResolvedValueOnce('hashedPassword');

      const result = await userService.createUser({
        email: 'new@example.com',
        password: 'password123',
        fullName: 'Test User',
        role: 'Employee',
      });

      expect(result).toBeDefined();
      expect(result.id).toBe(mockUser.id);
    });
  });

  // ---------------- UPDATE PASSWORD ----------------
  describe('updatePassword', () => {
    const userId = 'user-id';
    const passwordData = {
      currentPassword: 'oldpassword123',
      newPassword: 'newpassword123',
    };

    it('should update password successfully', async () => {
      const mockUser = {
        id: userId,
        password: 'hashedOldPassword',
        update: jest.fn().mockResolvedValue(true),
      };

      (database.User.findByPk as jest.Mock) = jest.fn().mockResolvedValue(mockUser);
      mockComparePassword.mockResolvedValue(true);
      mockHashPassword.mockResolvedValue('hashedNewPassword');

      const result = await userService.updatePassword(userId, passwordData);

      expect(result).toEqual({ message: 'Password updated successfully' });
      expect(mockUser.update).toHaveBeenCalledWith({ password: 'hashedNewPassword' });
    });

    it('should throw error when user not found', async () => {
      (database.User.findByPk as jest.Mock) = jest.fn().mockResolvedValue(null);

      await expect(userService.updatePassword(userId, passwordData)).rejects.toThrow('User not found');
    });

    it('should throw error when current password is incorrect', async () => {
      const mockUser = {
        id: userId,
        password: 'hashedOldPassword',
      };

      (database.User.findByPk as jest.Mock) = jest.fn().mockResolvedValue(mockUser);
      mockComparePassword.mockResolvedValue(false);

      await expect(userService.updatePassword(userId, passwordData)).rejects.toThrow(
        'Current password is incorrect'
      );
    });
  });

  // ---------------- GET ALL USERS ----------------
  describe('getAllUsers', () => {
    it('should return all users when found', async () => {
      const mockUsers = [
        { id: '1', fullName: 'User One', email: 'user1@example.com' },
        { id: '2', fullName: 'User Two', email: 'user2@example.com' },
      ];

      (database.User.findAll as jest.Mock) = jest.fn().mockResolvedValue(mockUsers);

      const result = await userService.getAllUsers();

      expect(result).toEqual(mockUsers);
      expect(database.User.findAll).toHaveBeenCalledWith({
        attributes: { exclude: ['password'] },
      });
    });

    it('should throw error when no users found', async () => {
      (database.User.findAll as jest.Mock) = jest.fn().mockResolvedValue([]);

      await expect(userService.getAllUsers()).rejects.toThrow('No users found');
    });
  });

  // ---------------- GET USER BY ID ----------------
  describe('getUserById', () => {
    it('should return user when found', async () => {
      const mockUser = { id: '1', fullName: 'Test User', email: 'test@example.com' };

      (database.User.findByPk as jest.Mock) = jest.fn().mockResolvedValue(mockUser);

      const result = await userService.getUserById('1');

      expect(result).toEqual(mockUser);
      expect(database.User.findByPk).toHaveBeenCalledWith('1', {
        attributes: { exclude: ['password'] },
      });
    });

    it('should throw error when user not found', async () => {
      (database.User.findByPk as jest.Mock) = jest.fn().mockResolvedValue(null);

      await expect(userService.getUserById('123')).rejects.toThrow('User not found');
    });
  });

  // ---------------- GET USER BY EMAIL ----------------
  describe('getUserByEmail', () => {
    it('should return user when found', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };

      (database.User.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockUser);

      const result = await userService.getUserByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(database.User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
    });

    it('should return null when user not found', async () => {
      (database.User.findOne as jest.Mock) = jest.fn().mockResolvedValue(null);

      const result = await userService.getUserByEmail('notfound@example.com');

      expect(result).toBeNull();
    });
  });

  // ---------------- TOGGLE USER STATUS ----------------
  describe('toggleUserStatus', () => {
    const userId = 'user-id';

    it('should update user status successfully', async () => {
      const mockUser = {
        id: userId,
        fullName: 'Test User',
        email: 'test@example.com',
        isActive: false,
        update: jest.fn().mockImplementation(function (this: any, data: any) {
          this.isActive = data.isActive;
          return Promise.resolve(this);
        }),
      };

      (database.User.findByPk as jest.Mock) = jest.fn().mockResolvedValue(mockUser);

      const result = await userService.toggleUserStatus(userId, true);

      expect(result).toEqual({
        id: mockUser.id,
        fullName: mockUser.fullName,
        email: mockUser.email,
        isActive: true,
      });
      expect(mockUser.update).toHaveBeenCalledWith({ isActive: true });
    });

    it('should throw error when user not found', async () => {
      (database.User.findByPk as jest.Mock) = jest.fn().mockResolvedValue(null);

      await expect(userService.toggleUserStatus(userId, true)).rejects.toThrow('User not found');
    });
  });
});
