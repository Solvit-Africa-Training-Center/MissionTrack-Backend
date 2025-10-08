import { Request, Response } from "express";
import { ResponseService } from "../utils/response";
import { AuthRequest } from "../utils/helper";
import { UpdateProfileService } from "../services/updateProfile";
import { EmployeeUpdateProfileInterface } from "../types/updateProfile";
import { UserService } from "../services/userService";
import { User } from "../database/models/users";
import cloudinary from "../utils/cloudinary";


const ALLOWED_ROLES = ["employee", "finance_manager"] as const;
export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    console.log("User ID from token:", userId);
    const userData = req.body;
    if (!userId) {
      return ResponseService({
        data: null,
        status: 401,
        success: false,
        message: "Unauthorized: User not logged in",
        res,
      });
    }
    const existingUser = await User.findOne({ where: { email: userData.email } });
    if (existingUser) {
      return ResponseService({
        data: null,
        status: 400,
        success: false,
        message: "User with this email already exists",
        res
      });
    }
    if (!userData.role || !ALLOWED_ROLES.includes(userData.role)) {
      return ResponseService({
        data: null,
        status: 400,
        success: false,
        message: "Invalid user role",
        res
      });
    }
    userData.companyId = req.user?.companyId;
    const newUser = await UserService.createUser(userData);
    return ResponseService({
      data: newUser,
      status: 201,
      success: true,
      message: "User created successfully",
      res
    })
  }
  catch (error) {
    const { message, stack } = error as Error;
    return ResponseService({
      data: stack,
      status: 500,
      success: false,
      message: message || "Intenal server error",
      res,
    });
  }
}

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.companyId) {
      return ResponseService({
        data: [],
        status: 400,
        success: false,
        message: "User information is missing from request",
        res
      });
    }
    const users = await UserService.getAllUsers(req.user.companyId);
    if (!users) {
      return ResponseService({
        data: [],
        status: 404,
        success: false,
        message: "No user found",
        res
      })
    }
    return ResponseService({
      data: users,
      status: 200,
      success: true,
      message: "All users fetched successfully", res
    })
  } catch (error) {
    const { message, stack } = error as Error;
    return ResponseService({
      data: stack,
      status: 500,
      success: false,
      message: message || "Internal server error",
      res
    });
  }
}


export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id;
    if (!req.user || !req.user.companyId) {
      return ResponseService({
        data: null,
        status: 400,
        success: false,
        message: "User information is missing from request",
        res
      });
    }
    const user = await UserService.getUserById(id, req.user.companyId);
    return ResponseService({
      data: user,
      status: 200,
      res,
      success: true,
      message: "User fetched successfully"
    })
  } catch (error) {
    const { message, stack } = error as Error;
    return ResponseService({
      data: stack,
      status: 500,
      success: false,
      message: message || "Internal server error",
      res
    });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id;
    const updateData = req.body;
    if (!req.user || !req.user.companyId) {
      return ResponseService({
        data: null,
        status: 400,
        success: false,
        message: "User information is missing from request",
        res
      });
    }
    const affectedCount = await UserService.updateUser(id, req.user.companyId, updateData);
    if (!affectedCount) {
      return ResponseService({
        data: null,
        status: 404,
        success: false,
        message: "User not Found",
        res
      })
    }
    return ResponseService({
      data: affectedCount,
      status: 200,
      success: true,
      message: "User updated successfully",
      res
    })
  } catch (error) {
    const { message, stack } = error as Error;
    return ResponseService({
      data: stack,
      status: 500,
      success: false,
      message: message || "Internal server error",
      res
    });
  }

};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id;
    if (!req.user || !req.user.companyId) {
      return ResponseService({
        data: null,
        status: 400,
        success: false,
        message: "User information is missing from request",
        res
      });
    }
    const deletedUser = await UserService.deleteUser(id, req.user.companyId);
    if (!deletedUser) {
      return ResponseService({
        data: deletedUser,
        status: 404,
        success: false,
        message: "User not Found",
        res
      })
    }
    return ResponseService({
      data: deletedUser,
      status: 200,
      success: true,
      message: "User deleted successfully",
      res
    })

  } catch (error) {
    const { message, stack } = error as Error;
    return ResponseService({
      data: stack,
      status: 500,
      success: false,
      message: message || "Internal server error",
      res
    });
  }
}
export const updateEmployeeprofile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return ResponseService({
        data: null,
        status: 401,
        success: false,
        message: "Unauthorized: User not logged in",
        res,
      });
    }
    const updateData = req.body as EmployeeUpdateProfileInterface;
    if (req.file) {
      const result=await cloudinary.uploader.upload(req.file.path)
      updateData.profilePhoto=result.secure_url;
    }
    if (!updateData) {
      return ResponseService({
        data: null,
        status: 400,
        success: false,
        message: "Invalid profile update data",
        res,
      });
    }
    Object.keys(updateData).forEach((key) => {
      const value = (updateData as Record<string, any>)[key];
      if (value === "" || value === null) {
        delete (updateData as Record<string, any>)[key];
      }
    });
    const updatedUser = await UpdateProfileService.updateEmployeeProfile(userId, updateData);
    if (!updatedUser) {
      return ResponseService({
        data: null,
        status: 404,
        success: false,
        message: "User not Found",
        res,
      });
    }
    return ResponseService({
      data: updatedUser,
      status: 200,
      success: true,
      message: "User profile updated successfully",
      res,
    });
  } catch (error) {
    const { message, stack } = error as Error;
    return ResponseService({
      data: stack,
      status: 500,
      success: false,
      message: message || "internal server error",
      res,
    });
  }
};
console.log("Cloudinary ENV:", process.env.CLOUDINARY_CLOUD_NAME, process.env.CLOUDINARY_API_KEY, process.env.CLOUDINARY_API_SECRET?.slice(0,4));


