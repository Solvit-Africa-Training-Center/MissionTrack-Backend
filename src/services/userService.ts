
import { User } from "../database/models/users"; 
import bcrypt from "bcrypt";
import { AddUserInterface,  userAttributes,  userUpateInterface } from "../types/userInterface";
import { Op } from "sequelize";

export class UserService {
    static async createUser(userData: AddUserInterface): Promise<userAttributes> {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const newUser = await User.create({ ...userData, password: hashedPassword });
            return newUser.toJSON() as userAttributes;
    }

    static async getUserById(id: string,companyId:string): Promise<userAttributes> {
            const user = await User.findOne({ where: { id, companyId } });
            if (!user) {
                throw new Error(`User with id ${id} not found`);
            }
            return user.toJSON() as userAttributes;
    }
    static async getAllUsers(companyId:string): Promise<userAttributes[]> {
            const users = await User.findAll({where: {
            companyId,
            role: { [Op.ne]: "admin" } 
        }});
            return users.map(user => user.toJSON() as userAttributes);
    }
   static async updateUser(id: string, companyId:string, updateData: Partial<userUpateInterface>): Promise<userUpateInterface> {
    const user = await User.findOne({ where: { id, companyId } });

    if (!user) {
        throw new Error(`User with id ${id} not found`);
    }

    await user.update(updateData);
    return user.toJSON() as userUpateInterface;
}
// update user profile

static async deleteUser(id: string,companyId:string): Promise<number> {
    const user = await User.findOne({ where: { id, companyId } });
    if (!user) {
        throw new Error(`User with id ${id} not found`);
    }
    await user.destroy();
    return 1;
}




}