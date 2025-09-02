import { Response, NextFunction } from "express";
import { ResponseService } from "../utils/response";
import { IRequestUser } from "./authMiddleware";

/**
 * Middleware to restrict access to Admin users only
 */
export const adminMiddleware = async (
  req: IRequestUser,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || !req.user.role) {
      return ResponseService({
        data: null,
        status: 403,
        success: false,
        message: "Access denied. Admin privileges required.",
        res,
      });
    }

    if (req.user.role !== "Admin") {
      return ResponseService({
        data: null,
        status: 403,
        success: false,
        message: "Access denied. Admin privileges required.",
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
      message: "Error checking admin permissions",
      res,
    });
  }
};


