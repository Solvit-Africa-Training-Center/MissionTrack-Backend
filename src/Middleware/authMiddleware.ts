import { Request, Response, NextFunction } from "express";
import { ResponseService } from "../utils/response";
import { verifyToken } from "../utils/helper";
import rateLimit from "express-rate-limit";

// Rate limiting middleware
export const rateLimiting = (customLimit?: number) =>
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: customLimit || 100,
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  });

interface JwtPayload {
  id?: string;
  email?: string;
  role?: "Employee" | "Manager" | "Finance" | "Admin";
  iat?: number;
  exp?: number;
}

export interface IRequestUser extends Request {
  user?: JwtPayload;
  token?: string;
}

// Authentication middleware
export const authMiddleware = async (
  req: IRequestUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return ResponseService({
        data: null,
        status: 401,
        success: false,
        message: "Authentication token is missing",
        res,
      });
    }

    const user = (await verifyToken(token)) as JwtPayload;
    if (!user) {
      return ResponseService({
        data: null,
        status: 401,
        success: false,
        message: "Invalid authentication token",
        res,
      });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    const { message, stack } = error as Error;
    return ResponseService({
      data: { message, stack },
      status: 401,
      success: false,
      message: "Invalid authentication token",
      res,
    });
  }
};

// Role-based access control middleware
export const checkRole =
  (roles: Array<"Employee" | "Manager" | "Finance" | "Admin">) =>
  async (req: IRequestUser, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.role) {
        return ResponseService({
          data: null,
          status: 403,
          success: false,
          message: "Role information is missing",
          res,
        });
      }

      if (!roles.includes(req.user.role)) {
        return ResponseService({
          data: null,
          status: 403,
          success: false,
          message:
            "You do not have the required role to perform this action",
          res,
        });
      }

      next();
    } catch (error) {
      const { message } = error as Error;
      return ResponseService({
        data: { message },
        status: 500,
        success: false,
        message: "Error checking role permissions",
        res,
      });
    }
  };
