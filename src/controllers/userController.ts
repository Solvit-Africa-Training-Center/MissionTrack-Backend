// src/controllers/userController.ts
import { Request, Response } from "express";
import { ResponseService } from "../utils/response";
import { database } from "../database";


import {
  comparePassword,
  generateToken,
  hashPassword,
  destroyToken,
} from "../utils/helper";
import { IRequestUser } from "../Middleware/authMiddleware";

interface IRequestUserData extends Request {
  body: {
    fullName: string;
    email: string;
    password: string;
    role: "Employee" | "Manager" | "Finance" | "Admin";
    roleId?: string; // Add this as optional since it will be looked up
    department?: string;
    phone?: string;
    isActive?: boolean; // Optional, defaults to true
  };
}
interface IRequestPasswordUpdate extends Request {
  body: {
    currentPassword: string;
    newPassword: string;
  };
}

/**
 * Get all users (Admin-only)
 */
export const getAllUsers = async (req: IRequestUserData, res: Response) => {
  try {
    const users = await database.User.findAll({
      attributes: { exclude: ["password"] }, // never expose passwords
    });

    if (!users || users.length === 0) {
      return ResponseService({
        data: null,
        status: 404,
        success: false,
        message: "No users found",
        res,
      });
    }

    return ResponseService({
      data: { users },
      status: 200,
      success: true,
      message: "Users retrieved successfully",
      res,
    });
  } catch (err) {
    const { message, stack } = err as Error;
    return ResponseService({
      data: { message, stack },
      status: 500,
      success: false,
      res,
    });
  }
};

/**
 * Admin creates a new user (Employee/Manager/Finance)
 */
export const createUser = async (req: IRequestUserData, res: Response) => {
  try {
    const { fullName, email, password, role, department, phone, isActive } = req.body;

    // Check if email already exists
    const existingUser = await database.User.findOne({ where: { email } });
    if (existingUser) {
      return ResponseService({
        data: null,
        status: 409,
        success: false,
        message: "User already exists",
        res,
      });
    }

    // Find the role record to get the roleId
    const roleRecord = await database.Role.findOne({ 
      where: { name: role, isActive: true } 
    });
    
    if (!roleRecord) {
      return ResponseService({
        data: null,
        status: 400,
        success: false,
        message: `Invalid role: ${role}`,
        res,
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await database.User.create({
      fullName,
      email,
      password: hashedPassword,
      role,
      roleId: roleRecord.id, // Set the roleId foreign key
      department,
      phone,
      isActive: isActive !== undefined ? isActive : true,
    });

    return ResponseService({
      data: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        department: user.department,
        phone: user.phone,
      },
      message: "User created successfully",
      success: true,
      status: 201,
      res,
    });
  } catch (error) {
    const { message, stack } = error as Error;
    return ResponseService({
      data: { message, stack },
      status: 500,
      success: false,
      res,
    });
  }
};

/**
 * User login (Employee/Manager/Finance/Admin)
 */
export const loginUser = async (req: IRequestUserData, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await database.User.findOne({ where: { email } });
    if (!user) {
      return ResponseService({
        data: null,
        status: 404,
        success: false,
        message: "User not found",
        res,
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return ResponseService({
        data: null,
        status: 403,
        success: false,
        message: "Account is deactivated. Please contact administrator.",
        res,
      });
    }

    const validPassword = await comparePassword(password, user.password);
    if (!validPassword) {
      return ResponseService({
        data: null,
        status: 401,
        success: false,
        message: "Invalid email or password",
        res,
      });
    }

    const token = await generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return ResponseService({
      data: {
        token,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          department: user.department,
          phone: user.phone,
        },
      },
      status: 200,
      success: true,
      message: "Login successful",
      res,
    });
  } catch (err) {
    const { message, stack } = err as Error;
    return ResponseService({
      data: { message, stack },
      status: 500,
      success: false,
      res,
    });
  }
};

/**
 * Get user profile (authenticated user)
 */
export const getUserProfile = async (req: IRequestUser, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return ResponseService({
        data: null,
        status: 401,
        success: false,
        message: "User not authenticated",
        res,
      });
    }

    const user = await database.User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return ResponseService({
        data: null,
        status: 404,
        success: false,
        message: "User not found",
        res,
      });
    }

    return ResponseService({
      data: { user },
      status: 200,
      success: true,
      message: "Profile retrieved successfully",
      res,
    });
  } catch (err) {
    const { message, stack } = err as Error;
    return ResponseService({
      data: { message, stack },
      status: 500,
      success: false,
      res,
    });
  }
};

/**
 * Update user password (authenticated user)
 */
export const updatePassword = async (req: IRequestPasswordUpdate, res: Response) => {
  try {
    const userId = (req as IRequestUser).user?.id;
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
      return ResponseService({
        data: null,
        status: 401,
        success: false,
        message: "User not authenticated",
        res,
      });
    }

    const user = await database.User.findByPk(userId);
    if (!user) {
      return ResponseService({
        data: null,
        status: 404,
        success: false,
        message: "User not found",
        res,
      });
    }

    // Verify current password
    const validPassword = await comparePassword(currentPassword, user.password);
    if (!validPassword) {
      return ResponseService({
        data: null,
        status: 401,
        success: false,
        message: "Current password is incorrect",
        res,
      });
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update password
    await user.update({ password: hashedNewPassword });

    return ResponseService({
      data: null,
      status: 200,
      success: true,
      message: "Password updated successfully",
      res,
    });
  } catch (err) {
    const { message, stack } = err as Error;
    return ResponseService({
      data: { message, stack },
      status: 500,
      success: false,
      res,
    });
  }
};

/**
 * User logout
 */
export const logoutUser = async (req: IRequestUser, res: Response) => {
  try {
    const token = req.token;

    await destroyToken(token);

    return ResponseService({
      data: null,
      status: 200,
      success: true,
      message: "Logout successful",
      res,
    });
  } catch (err) {
    const { message, stack } = err as Error;
    return ResponseService({
      data: { message, stack },
      status: 500,
      success: false,
      res,
    });
  }
};
