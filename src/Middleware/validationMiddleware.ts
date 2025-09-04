import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { ResponseService } from "../utils/response";

// Validation schemas
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is required",
  }),
});

const createUserSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required().messages({
    "string.min": "Full name must be at least 2 characters long",
    "string.max": "Full name cannot exceed 100 characters",
    "any.required": "Full name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is required",
  }),
  role: Joi.string()
    .valid("Employee", "Manager", "Finance", "Admin")
    .required()
    .messages({
      "any.only": "Role must be one of: Employee, Manager, Finance, Admin",
      "any.required": "Role is required",
    }),
  department: Joi.string().max(100).optional().messages({
    "string.max": "Department cannot exceed 100 characters",
  }),
  phone: Joi.string().max(20).optional().messages({
    "string.max": "Phone number cannot exceed 20 characters",
  }),
  isActive: Joi.boolean().optional().messages({
    "boolean.base": "isActive must be a boolean value",
  }),
});

const updatePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    "any.required": "Current password is required",
  }),
  newPassword: Joi.string().min(6).required().messages({
    "string.min": "New password must be at least 6 characters long",
    "any.required": "New password is required",
  }),
});

// Validation middleware factory
const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorMessage = error.details[0].message;
      return ResponseService({
        data: null,
        status: 400,
        success: false,
        message: errorMessage,
        res,
      });
    }
    
    next();
  };
};

// Export validation middlewares
export const validateLogin = validateRequest(loginSchema);
export const validateCreateUser = validateRequest(createUserSchema);
export const validateUpdatePassword = validateRequest(updatePasswordSchema);

// Generic validation middleware for custom schemas
export const validateBody = (schema: Joi.ObjectSchema) => {
  return validateRequest(schema);
};
