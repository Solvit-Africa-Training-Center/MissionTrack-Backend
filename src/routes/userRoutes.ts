import { Router } from "express";
import { 
  getAllUsers, 
  createUser, 
  loginUser, 
  logoutUser,
  getUserProfile,
  updatePassword 
} from "../controllers/userController";
import { authMiddleware } from "../Middleware/authMiddleware";
import { adminMiddleware } from "../Middleware/adminMiddleware";
import { 
  validateLogin, 
  validateCreateUser, 
  validateUpdatePassword 
} from "../Middleware/validationMiddleware";

const router = Router();

// Public routes
router.post("/login", validateLogin, loginUser);

// Protected routes
router.use(authMiddleware);
router.get("/profile", getUserProfile);
router.post("/logout", logoutUser);
router.put("/password", validateUpdatePassword, updatePassword);

// Admin only routes
router.use(adminMiddleware);
router.get("/", getAllUsers);
router.post("/", validateCreateUser, createUser);

export default router;