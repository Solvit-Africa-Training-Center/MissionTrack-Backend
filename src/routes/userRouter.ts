import { Router } from "express";
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from "../controllers/userController";
import { validationMiddleware } from "../middlewares/validationMiddleware";
import { addUserSchema, updateUserSchema } from "../schemas/userSchema";

const userRouter=Router();

userRouter.get("/users",getAllUsers);
userRouter.get("/users/:id",getUserById);
userRouter.post("/users", validationMiddleware({ type: "body", schema: addUserSchema }), createUser);
userRouter.patch("/users/:id", validationMiddleware({ type: "body", schema: updateUserSchema }), updateUser);
userRouter.delete("/users/:id",deleteUser);

export default userRouter;