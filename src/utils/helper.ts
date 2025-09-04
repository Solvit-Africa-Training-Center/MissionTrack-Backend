import { config } from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { redis } from "./redis";
import { v4 as uuidv4 } from "uuid";
import { errorLogger } from "./logger";

config();

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const secretKey = process.env.JWT_SECRET || "MissionSecretKey";

/**
 * Generate JWT and store in Redis (12h expiry)
 */
export const generateToken = async ({
  id,
  email,
  role,
}: {
  id: string;
  email: string;
  role: "Employee" | "Manager" | "Finance" | "Admin";
}): Promise<string> => {
  const payload = { id, email, role };
  const jti = uuidv4(); // unique identifier for the token
  const tokenPayload = { ...payload, jti };

  const token = jwt.sign(tokenPayload, secretKey, { expiresIn: "12h" });

  // store in redis with same expiration (12 hours)
  await redis.setEx(
    `jwt:${jti}`,
    12 * 60 * 60,
    JSON.stringify(tokenPayload)
  );

  return token;
};

/**
 * Verify JWT and check Redis blacklist
 */
export const verifyToken = async (token: string): Promise<any> => {
  try {
    const decoded = jwt.verify(token, secretKey) as any;

    // Check if still exists in Redis
    const storedData = await redis.get(`jwt:${decoded.jti}`);
    if (!storedData) {
      throw new Error("Token not found in Redis - may have expired/revoked");
    }

    // Check if token is blacklisted
    const isBlacklisted = await redis.get(`blacklist:${token}`);
    if (isBlacklisted) {
      throw new Error("Token has been blacklisted");
    }

    return decoded;
  } catch (error) {
    errorLogger(error as Error, "Token Verification");
    throw error;
  }
};

/**
 * Logout: blacklist the token in Redis for 24h
 */
export const destroyToken = async (
  token: string | undefined
): Promise<void> => {
  try {
    if (!token) return;
    await redis.setEx(`blacklist:${token}`, 24 * 60 * 60, "true");
  } catch (error) {
    errorLogger(error as Error, "Token Destruction");
    throw error;
  }
};

/**
 * Validate password strength
 */
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Generate a secure random password
 */
export const generateSecurePassword = (length: number = 12): string => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  
  // Ensure at least one character from each category
  password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)]; // uppercase
  password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)]; // lowercase
  password += "0123456789"[Math.floor(Math.random() * 10)]; // number
  password += "!@#$%^&*"[Math.floor(Math.random() * 8)]; // special
  
  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

/**
 * Check if user has permission for specific action
 */
export const checkPermission = (
  userRole: "Employee" | "Manager" | "Finance" | "Admin",
  requiredRole: "Employee" | "Manager" | "Finance" | "Admin"
): boolean => {
  const roleHierarchy = {
    Employee: 1,
    Manager: 2,
    Finance: 3,
    Admin: 4,
  };
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

/**
 * Get user permissions based on role
 */
export const getUserPermissions = (role: "Employee" | "Manager" | "Finance" | "Admin") => {
  const permissions = {
    Employee: [
      "create_mission",
      "view_own_missions",
      "update_own_profile",
      "submit_expenses",
    ],
    Manager: [
      "create_mission",
      "view_own_missions",
      "view_team_missions",
      "approve_missions",
      "update_own_profile",
      "submit_expenses",
    ],
    Finance: [
      "view_all_missions",
      "approve_financial_requests",
      "generate_reports",
      "update_own_profile",
    ],
    Admin: [
      "create_user",
      "manage_users",
      "view_all_missions",
      "approve_missions",
      "approve_financial_requests",
      "generate_reports",
      "system_configuration",
    ],
  };
  
  return permissions[role] || [];
};
