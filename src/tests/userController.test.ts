import { Request, Response } from "express";
import * as userController from "../controllers/userController";
import { UserService } from "../services/userSercives";
import { User } from "../database/models/users";

jest.mock("../services/userSercives", () => ({
  UserService: {
    createUser: jest.fn(),
    getAllUsers: jest.fn(),
    deleteUser: jest.fn(),
    updateUser: jest.fn(),
    getUserById: jest.fn(),
  },
}));

describe("UserController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("createUser", () => {
    // Test user create already exist
    it("should return 400 if user already exists", async () => {
      req.body = { fullName: "John Doe", email: "john@example.com", password: "123456" };
      (User.findOne as jest.Mock).mockResolvedValue({ id: 1, email: "john@example.com" });
      await userController.createUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        data: null,
        status: 400,
        success: false,
        message: "User with this email arleady exists",
      });
    });

    // test create new user
    it("should create a user", async () => {
      req.body = { fullName: "John Doe", email: "john@example.com", password: "password123" };
      (UserService.createUser as jest.Mock).mockResolvedValue({ id: 1, ...req.body });

      await userController.createUser(req as Request, res as Response);

      expect(UserService.createUser).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        data: { id: 1, ...req.body },
        status: 201,
        success: true,
        message: "User Created successfully",
      });

    });

    // Test if create user fail.
    it("should return 500 if createUser fails", async () => {
     req.body = { fullName: "John Doe", email: "john@example.com", password: "123456" };
      (User.findOne as jest.Mock).mockRejectedValue(new Error("DB error"));

      (UserService.createUser as jest.Mock).mockRejectedValue(new Error("Service error"));

      await userController.createUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Service error" });
    });
  });
  // Tests for get all system users
  describe("getAllUsers", () => {

    it("should return 404 if no users found", async () => {
      (UserService.getAllUsers as jest.Mock).mockResolvedValue([]);

      await userController.getAllUsers(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        data: [],
        status: 404,
        success: false,
        message: "No user found",
      });
    });

    it("should retrieve all users", async () => {
      const fakeUsers = [
        { id: 1, fullName: "John Doe", email: "john@example.com" },
        { id: 2, fullName: "Jane Doe", email: "jaelle@example.com" },
      ];
      (UserService.getAllUsers as jest.Mock).mockResolvedValue(fakeUsers);

      await userController.getAllUsers(req as Request, res as Response);

      expect(UserService.getAllUsers).toHaveBeenCalledWith();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "All users fetched successfully",
        data: fakeUsers,
        success: true,
        status: 200
      });
    });

    it("should return 500 if getAllUsers fails", async () => {
      (UserService.getAllUsers as jest.Mock).mockRejectedValue(new Error("Failed to get alll users"));

      await userController.getAllUsers(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        data: expect.any(String),
        status: 500,
        success: false,
        message: "Failed to get alll users",
      });
    });
  });

  // Test getSingle User
  describe("getUserById", () => {
    it("should return a user by id", async () => {
      req.params = { id: "1" };
      (UserService.getUserById as jest.Mock).mockResolvedValue({ id: "1", fullName: "John Doe" });

      await userController.getUserById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: { id: "1", fullName: "John Doe" },
        status: 200,
        success: true,
        message: "User fetched successfully",
      });
    });

    it("should return 500 if getUserById throws", async () => {
      req.params = { id: "99" };
      (UserService.getUserById as jest.Mock).mockRejectedValue(new Error("Not found"));

      await userController.getUserById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        data: expect.any(String),
        status: 500,
        success: false,
        message: "Not found",
      });
    });
  });

  //Test for Update the User
  describe("updateUser", () => {
    it("should update a user", async () => {
      req.params = { id: "1" };
      req.body = { fullName: "Updated User" };
      (UserService.updateUser as jest.Mock).mockResolvedValue({ id: "1", fullName: "Updated User" });

      await userController.updateUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: { id: "1", fullName: "Updated User" },
        status: 200,
        success: true,
        message: "User updated successfully",
      });
    });

    it("should return 404 if user not found", async () => {
      req.params = { id: "99" };
      req.body = { fullName: "Does Not Exist" };
      (UserService.updateUser as jest.Mock).mockResolvedValue(null);

      await userController.updateUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        data: null,
        status: 404,
        success: false,
        message: "User not Found",
      });
    });

    it("should return 500 if updateUser throws", async () => {
      req.params = { id: "1" };
      req.body = { fullName: "Error Case" };
      (UserService.updateUser as jest.Mock).mockRejectedValue(new Error("DB error"));

      await userController.updateUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        data: expect.any(String),
        status: 500,
        success: false,
        message: "DB error",
      });
    });
  });

  // Test delete User
  describe("deleteUser", () => {
    it("should not found", async () => {
      req.params = { id: "1" };
      (User.findOne as jest.Mock).mockResolvedValue({ id: 1 });
      await userController.deleteUser(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        data: null,
        status: 404,
        success: false,
        message: "User not Found",
      });
    })

    it("should delete a user", async () => {
      req.params = { id: "1" };
      (UserService.deleteUser as jest.Mock).mockResolvedValue(1);

      await userController.deleteUser(req as Request, res as Response);

      expect(UserService.deleteUser).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: 1,
        status: 200,
        success: true,
        message: "User deleted successfully",
      });

    });
     it("should return 500 if deleteUser throws", async () => {
    req.params = { id: "1" };
    (UserService.deleteUser as jest.Mock).mockRejectedValue(new Error("Delete failed"));

    await userController.deleteUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      data: expect.any(String),
      status: 500,
      success: false,
      message: "Delete failed",
    });
  });
})
});
