// src/controllers/authController.ts
import { Request, Response } from "express";
import { ResponseService } from "../utils/response";
import { database } from "../database";
import {AuthServices} from "../services/authService";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  hashPassword,
} from "../utils/helper";

/**
 * User login (Employee/Manager/Finance/Admin)
 */

export class AuthController{
static async loginUser(req: Request, res: Response){
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
    if (!user.is_active) {
      return ResponseService({
        data: null,
        status: 403,
        success: false,
        message: "Account is deactivated. Please contact administrator.",
        res,
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return ResponseService({
        data: null,
        status: 401,
        success: false,
        message: "Invalid credentials",
        res,
      });
    }

 const { token } = await AuthServices.login(email, password);
     return ResponseService({
      data: {
        token,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          companyId: user.companyId,
          department: user.department,
          phone: user.phoneNumber,
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
 * User logout
 */
static async logoutUser(req: Request, res: Response){
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if(!token){
      return ResponseService({
        data:null,
        status:400,
        success:false,
        message:"No token provided",
        res
      })
    }
    const result=await AuthServices.logoutUser(token);
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

/**
 * Forgot Password - send reset email
 */
static async forgotPassword(req: Request, res: Response){
  try {
    const { email } = req.body;

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

    const token = await AuthServices.forgotPassword(email);
    return ResponseService({
      data:{token},
      status:200,
      success:true,
      message:"Password reset token sent to Email",
      res
    })

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
 * Reset Password
 */
static async resetPassword(req: Request, res: Response){
  try {
    const token = req.params.token || req.body.token; 
    const { newPassword, confirmPassword } = req.body;

    if (!token) {
      return ResponseService({
        data:null,
        status:400,
        res,
        success: false,
        message: "Invalid or missing token",
      });
    }

    if (!newPassword || !confirmPassword) {
      return ResponseService({
        data:null,
        status:400,
        res,
        success: false,
        message: "Both new password and confirm password are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return ResponseService({
        res,
        data:null,
        status:400,
        success: false,
        message: "Passwords do not match",
      });
    }

    // 🔐 Verify token
    let payload: { email: string };
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET as string) as {
        email: string;
      };
    } catch (err) {
      return ResponseService({
        res,
        data:null,
        status:400,
        success: false,
        message: "Invalid or expired token",
      });
    }

    // 🔎 Find user
   const user = await database.User.findOne({ where: { email: payload.email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 🔑 Hash new password
    const hashedPassword = await hashPassword(newPassword);
    await user.update({ password: hashedPassword });

    return res.status(200).json({
      success: true,
      message: "Password reset successful! You can now log in with your new password.",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: { message: error.message },
    });
  }
};

/**
 * Update user password (authenticated user)
 */
static async changePassword  (req: Request, res: Response) {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = (req as any).user.id;

    if(!currentPassword || !newPassword){
      return ResponseService({
        data:null,
        status:400,
        res,
        success:false,
        message:"Both current and new passwords are required",
      })
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
    const validPassword = await bcrypt.compare(currentPassword, user.password);
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
  }}
};