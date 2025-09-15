
import { User } from "../database/models/users"; 
import bcrypt from "bcrypt";
import { AddUserInterface, userInterface } from "../types/userInterface";

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
            const users = await User.findAll();
            return users.map(user => user.toJSON() as userInterface);
    }
    static async updateUser(id: string, updateData: Partial<userInterface>): Promise<userInterface> {
            const [affectedCount,updatedUser] = await User.update(updateData, {
                where: { id },
                returning:true
            });
            if (affectedCount===0){
                throw new Error(`User with id ${id} not found`);
            };
            return updatedUser[0].toJSON() as userInterface;

    }
    static async deleteUser(id: string): Promise<number> {
            const deleteUser = await User.destroy({
                where: { id }
            });
            if(deleteUser===0){
                throw new Error(`User with id ${id} not found`);
            }
            return deleteUser;
    }

}