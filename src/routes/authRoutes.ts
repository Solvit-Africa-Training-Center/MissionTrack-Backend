import Router from "express";
import { AuthController } from "../controllers/authController";
import { authenticate } from "../middlewares/authMiddleware";


const authRouter=Router();

authRouter.post("/users/login",AuthController.loginUser);
authRouter.post("/users/logout",authenticate,AuthController.logoutUser);
authRouter.post("/users/forgotPassword",AuthController.forgotPassword);
authRouter.post("/users/resetPassword",AuthController.resetPassword);
authRouter.post("/users/changePassword",authenticate,AuthController.changePassword);

export default authRouter;