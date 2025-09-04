import Joi from "joi";

// User validation schemas
export const userSchemas = {
  // Login validation
  login: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters long",
      "any.required": "Password is required",
    }),
  }),

  // Create user validation (Admin only)
  createUser: Joi.object({
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
  }),

  // Update password validation
  updatePassword: Joi.object({
    currentPassword: Joi.string().required().messages({
      "any.required": "Current password is required",
    }),
    newPassword: Joi.string().min(6).required().messages({
      "string.min": "New password must be at least 6 characters long",
      "any.required": "New password is required",
    }),
  }),

  // Update user profile validation
  updateProfile: Joi.object({
    fullName: Joi.string().min(2).max(100).optional().messages({
      "string.min": "Full name must be at least 2 characters long",
      "string.max": "Full name cannot exceed 100 characters",
    }),
    department: Joi.string().max(100).optional().messages({
      "string.max": "Department cannot exceed 100 characters",
    }),
    phone: Joi.string().max(20).optional().messages({
      "string.max": "Phone number cannot exceed 20 characters",
    }),
  }),

  // Admin update user validation
  adminUpdateUser: Joi.object({
    fullName: Joi.string().min(2).max(100).optional().messages({
      "string.min": "Full name must be at least 2 characters long",
      "string.max": "Full name cannot exceed 100 characters",
    }),
    email: Joi.string().email().optional().messages({
      "string.email": "Please provide a valid email address",
    }),
    role: Joi.string()
      .valid("Employee", "Manager", "Finance", "Admin")
      .optional()
      .messages({
        "any.only": "Role must be one of: Employee, Manager, Finance, Admin",
      }),
    department: Joi.string().max(100).optional().messages({
      "string.max": "Department cannot exceed 100 characters",
    }),
    phone: Joi.string().max(20).optional().messages({
      "string.max": "Phone number cannot exceed 20 characters",
    }),
    isActive: Joi.boolean().optional(),
  }),
};

// Export individual schemas for convenience
export const loginSchema = userSchemas.login;
export const createUserSchema = userSchemas.createUser;
export const updatePasswordSchema = userSchemas.updatePassword;
export const updateProfileSchema = userSchemas.updateProfile;
export const adminUpdateUserSchema = userSchemas.adminUpdateUser;
