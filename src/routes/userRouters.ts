
import { Router } from "express";
import { createUser, deleteUser, getAllUsers, getUserById,updateEmployeeprofile, updateUser } from "../controllers/userController";
import { validationMiddleware } from "../middlewares/validationMiddleware";
import { addUserSchema, updateUserSchema } from "../schemas/userSchema";
import { checkRoleMiddleware } from "../middlewares/checkRoleMiddleware";
import { uploadProfilePhoto } from "../middlewares/uploadFiles";
import { RequestHandler } from "express";
const userRouter=Router();

userRouter.get("/users",checkRoleMiddleware(["manager"]),getAllUsers);
userRouter.get("/users/:id",checkRoleMiddleware(["manager"]),getUserById);
userRouter.post("/users", validationMiddleware({ type: "body", schema: addUserSchema }), createUser);
userRouter.patch("/users/profile",checkRoleMiddleware(["employee","finance_manager","manager"]), uploadProfilePhoto.single("profilePhoto"),updateEmployeeprofile as unknown as RequestHandler);
userRouter.patch("/users/:id",checkRoleMiddleware(["manager"]), validationMiddleware({ type: "body", schema: updateUserSchema }), updateUser);
userRouter.delete("/users/:id",checkRoleMiddleware(["manager"]),deleteUser);

export default userRouter;