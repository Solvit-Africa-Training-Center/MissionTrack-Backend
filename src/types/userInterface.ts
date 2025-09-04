// src/types/userInterface.ts

export interface IUser {
  id: string;
  roleId: string;
  fullName: string;
  email: string;
  role: "Employee" | "Manager" | "Finance" | "Admin";
  department?: string;
  phone?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserWithoutPassword extends Omit<IUser, 'password'> {}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    token: string;
    user: IUserWithoutPassword;
  };
}

export interface ICreateUserRequest {
  fullName: string;
  email: string;
  password: string;
  role: "Employee" | "Manager" | "Finance" | "Admin";
  department?: string;
  phone?: string;
  isActive?: boolean;
}

export interface IUpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface IUserProfileResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    user: IUserWithoutPassword;
  };
}

export interface IApiResponse<T = any> {
  success: boolean;
  status: number;
  message: string;
  data: T | null;
}

export interface IJwtPayload {
  id: string;
  email: string;
  role: "Employee" | "Manager" | "Finance" | "Admin";
  iat?: number;
  exp?: number;
}

export interface IRole {
  id: string;
  name: "Employee" | "Manager" | "Finance" | "Admin";
  description?: string;
  permissions: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthenticatedRequest {
  user?: IJwtPayload;
  token?: string;
}

// Error response interfaces
export interface IErrorResponse {
  success: false;
  status: number;
  message: string;
  data: {
    message: string;
    stack?: string;
  } | null;
}

// Validation error interface
export interface IValidationError {
  field: string;
  message: string;
}

// Rate limiting interface
export interface IRateLimitOptions {
  windowMs: number;
  max: number;
  message: string;
}