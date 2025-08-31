
import { User } from "../database/models/users"; 
import { AddUserInterface, userInterface } from "../types/userInterface";

export class UserService {
    static async createUser(userData: AddUserInterface): Promise<userInterface> {
        try {
            const user = await User.create(userData);
            return user.toJSON() as userInterface;
        } catch (error) {
            throw error;
        }
    }

    static async getUserById(id: string): Promise<userInterface> {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                throw new Error(`User with id ${id} not found`);
            }
            return user.toJSON() as userInterface;
        } catch (error) {
            throw error;
        }
    }
    static async getAllUsers(): Promise<userInterface[]> {
        try {
            const users = await User.findAll();
            return users.map(user => user.toJSON() as userInterface);
        } catch (error) {
            throw error;
        }
    }
    static async updateUser(id: string, updateData: Partial<userInterface>): Promise<number> {
        try {
            const [affectedCount] = await User.update(updateData, {
                where: { id }
            });
            return affectedCount;
        } catch (error) {
            throw error;
        }
    }
    static async deleteUser(id: string): Promise<number> {
        try {

            const deleteUser = await User.destroy({
                where: { id }
            })
            return deleteUser;

        } catch (error) {
            throw error;

        }
    }

}