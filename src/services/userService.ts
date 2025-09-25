
import { User } from "../database/models/users"; 
import bcrypt from "bcrypt";
import { AddUserInterface, userInterface, userUpateInterface } from "../types/userInterface";
import { Op } from "sequelize";

export class UserService {
    static async createUser(userData: AddUserInterface): Promise<userInterface> {
            const hashedPassword=await bcrypt.hash(userData.password,10);
            const user = await User.create({...userData,password:hashedPassword});
            return user.toJSON() as userInterface;
    }

    static async getUserById(id: string): Promise<userInterface> {
            const user = await User.findByPk(id);
            if (!user) {
                throw new Error(`User with id ${id} not found`);
            }
            return user.toJSON() as userInterface;
    }
    static async getAllUsers(): Promise<userInterface[]> {
            const users = await User.findAll({    where: {
            role: { [Op.ne]: "admin" } 
        }});
            return users.map(user => user.toJSON() as userInterface);
    }
   static async updateUser(id: string, updateData: Partial<userUpateInterface>): Promise<userUpateInterface> {
    const user = await User.findByPk(id);

    if (!user) {
        throw new Error(`User with id ${id} not found`);
    }
    if (user.role === "admin") {
        throw new Error("Admin user cannot be updated");
    }

    await user.update(updateData);
    return user.toJSON() as userUpateInterface;
}
// update user profile

static async deleteUser(id: string): Promise<number> {
    const user = await User.findByPk(id);
    if (!user) {
        throw new Error(`User with id ${id} not found`);
    }
    if (user.role === "admin") {
        throw new Error("Admin user cannot be deleted");
    }
    await user.destroy();
    return 1;
}




}