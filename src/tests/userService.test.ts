    import { User } from "../database/models/users";
import { UserService } from "../services/userSercives";

    jest.mock("../database/models/users", () => ({
        User: {
            create: jest.fn(),
            findByPk: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            destroy: jest.fn(),
        }
    }));

    describe("UserService", () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        describe("createUser", () => {
            // test create user
            it("should create a user", async () => {
                const fakeUserData = { id: 1, fullName: "pasific", email: "pasific@example.come", password: "password123" };
                (User.create as jest.Mock).mockResolvedValue({ toJSON: jest.fn(() => fakeUserData) });

                const result = await UserService.createUser(fakeUserData as any);
                expect(result).toEqual(fakeUserData);
            });
            
            it("should throw an error if createUser fails", async () => {
                const fakeUserData = { fullName: "bad user", email: "bad@example.com", password: "123456" };

                (User.create as jest.Mock).mockRejectedValue(new Error("DB error"));

                await expect(UserService.createUser(fakeUserData as any))
                    .rejects
                    .toThrow("DB error");
            });


            // test for get single user by using id
            it("should get user by id", async () => {
                const fakeUserData = { id: 2, fullName: "John Bosco", email: "bosco@gmail.com" };
                (User.findByPk as jest.Mock).mockResolvedValue({ toJSON: jest.fn(() => fakeUserData) });

                const result = await UserService.getUserById("2");
                expect(result).toEqual(fakeUserData);
            });

            it("should throw error if user not found", async () => {
                (User.findByPk as jest.Mock).mockResolvedValue(null);

                await expect(UserService.getUserById("999")).rejects.toThrow("User with id 999 not found");
            });


            // test update user
            it("should update user by id", async () => {
                const fakeData = { id: 2, fullName: "John Bosco", email: "bosco@gmail.com" };
                (User.update as jest.Mock).mockResolvedValue([1, [{ toJSON: jest.fn(() => fakeData) }]]);

                const result = await UserService.updateUser("2", fakeData as any);
                expect(result).toEqual(fakeData);
            });

            it("should display the error message when the user not found", async () => {
                (User.update as jest.Mock).mockResolvedValue([0, []]);

                await expect(UserService.updateUser("999", {})).rejects.toThrow("User with id 999 not found");
            });


            // test delete user
            it("should delete user by id", async () => {
                (User.destroy as jest.Mock).mockResolvedValue(1);

                const result = await UserService.deleteUser("2");
                expect(result).toBe(1);
            });

            it("should display the error message when the user to delete not found", async () => {
                (User.destroy as jest.Mock).mockResolvedValue(0);

                await expect(UserService.deleteUser("999")).rejects.toThrow("User with id 999 not found");
            });

            // test get all users
            it("should get all users", async () => {
                const fakeData = [
                 {toJSON:()=>({ id: 1, fullName: "User One", email: "userOne@gmail.com" })},
                   {toJSON:()=>( { id: 2, fullName: "User Two", email: "user2@gmail.com" })}
                ];
                (User.findAll as jest.Mock).mockResolvedValue(fakeData);
                const result = await UserService.getAllUsers();
                expect(result).toEqual(fakeData);
            })

        })
    })