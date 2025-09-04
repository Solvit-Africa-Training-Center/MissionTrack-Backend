import request from "supertest";
import express from "express";
import userRoutes from "../../routes/userRoutes";

// Mock controllers
jest.mock("../../controllers/userController", () => ({
  getAllUsers: jest.fn((req, res) => res.status(200).json([{ id: 1, name: "Test User" }])),
  createUser: jest.fn((req, res) => res.status(201).json({ message: "User created" })),
  loginUser: jest.fn((req, res) => res.status(200).json({ token: "fake-jwt" })),
  logoutUser: jest.fn((req, res) => res.status(200).json({ message: "Logged out" })),
  getUserProfile: jest.fn((req, res) => res.status(200).json({ id: 1, name: "Profile User" })),
  updatePassword: jest.fn((req, res) => res.status(200).json({ message: "Password updated" })),
}));

// Mock middlewares
jest.mock("../../Middleware/authMiddleware", () => ({
  authMiddleware: (req: any, res: any, next: any) => next(),
}));
jest.mock("../../Middleware/adminMiddleware", () => ({
  adminMiddleware: (req: any, res: any, next: any) => next(),
}));
jest.mock("../../Middleware/validationMiddleware", () => ({
  validateLogin: (req: any, res: any, next: any) => next(),
  validateCreateUser: (req: any, res: any, next: any) => next(),
  validateUpdatePassword: (req: any, res: any, next: any) => next(),
}));

const app = express();
app.use(express.json());
app.use("/users", userRoutes);

describe("User Routes", () => {
  it("POST /users/login should call loginUser", async () => {
    const res = await request(app).post("/users/login").send({ email: "a@a.com", password: "123456" });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ token: "fake-jwt" });
  });

  it("GET /users/profile should call getUserProfile", async () => {
    const res = await request(app).get("/users/profile");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1, name: "Profile User" });
  });

  it("POST /users/logout should call logoutUser", async () => {
    const res = await request(app).post("/users/logout");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Logged out" });
  });

  it("PUT /users/password should call updatePassword", async () => {
    const res = await request(app).put("/users/password").send({ oldPassword: "old", newPassword: "new" });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Password updated" });
  });

  it("GET /users should call getAllUsers (admin only)", async () => {
    const res = await request(app).get("/users");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1, name: "Test User" }]);
  });

  it("POST /users should call createUser (admin only)", async () => {
    const res = await request(app).post("/users").send({ name: "New User", email: "test@test.com" });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ message: "User created" });
  });
});
