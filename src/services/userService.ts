// src/services/userService.ts

import { database } from "../database";
import { hashPassword, comparePassword } from "../utils/helper";
import { UserCreationAttribute } from "../database/models/User";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface CreateUserData {
  fullName: string;
  email: string;
  password: string;
  role: "Employee" | "Manager" | "Finance" | "Admin";
  department?: string;
  phone?: string;
  isActive?: boolean;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export class UserService {
  /**
   * Authenticate user login
   */
  async login(credentials: LoginCredentials) {
    const { email, password } = credentials;

    const user = await database.User.findOne({ where: { email } });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (!user.isActive) {
      throw new Error("Account is deactivated. Please contact administrator.");
    }

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid email or password");
    }

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      department: user.department,
      phone: user.phone,
    };
  }

  /**
   * Create a new user (Admin only)
   */
  async createUser(userData: CreateUserData) {
    const { fullName, email, password, role, department, phone, isActive } = userData;

    // Check if email already exists
    const existingUser = await database.User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("User already exists");
    }

    // Find the role record to get the roleId
    const roleRecord = await database.Role.findOne({ 
      where: { name: role, isActive: true } 
    });
    
    if (!roleRecord) {
      throw new Error(`Invalid role: ${role}`);
    }

    const hashedPassword = await hashPassword(password);

    const user = await database.User.create({
      fullName,
      email,
      password: hashedPassword,
      role,
      roleId: roleRecord.id,
      department,
      phone,
      isActive: isActive !== undefined ? isActive : true,
    });

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      department: user.department,
      phone: user.phone,
    };
  }

  /**
   * Get all users (Admin only)
   */
  async getAllUsers() {
    const users = await database.User.findAll({
      attributes: { exclude: ["password"] },
    });

    if (!users || users.length === 0) {
      throw new Error("No users found");
    }

    return users;
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string) {
    const user = await database.User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  /**
   * Update user password
   */
  async updatePassword(userId: string, passwordData: UpdatePasswordData) {
    const { currentPassword, newPassword } = passwordData;

    const user = await database.User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Verify current password
    const isValidPassword = await comparePassword(currentPassword, user.password);
    if (!isValidPassword) {
      throw new Error("Current password is incorrect");
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update password
    await user.update({ password: hashedNewPassword });

    return { message: "Password updated successfully" };
  }

  /**
   * Check if user exists by email
   */
  async getUserByEmail(email: string) {
    const user = await database.User.findOne({ where: { email } });
    return user;
  }

  /**
   * Activate/Deactivate user (Admin only)
   */
  async toggleUserStatus(userId: string, isActive: boolean) {
    const user = await database.User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }

    await user.update({ isActive });
    
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      isActive: user.isActive,
    };
  }
}