import { User } from "../database/models/users";
import { companyUpdateProfileInterface, EmployeeUpdateProfileInterface } from "../types/updateProfile";
import { Company } from "../database/models/company"; 


export class UpdateProfileService {
  
  static async updateEmployeeProfile(userId: string, updateProfileData: EmployeeUpdateProfileInterface) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    await user.update(updateProfileData);
    return user.toJSON();
  }

 
  static async updateCompanyProfile(companyId: string, updateData: companyUpdateProfileInterface) {
    const company = await Company.findByPk(companyId);

    if (!company) {
      throw new Error(`Company with id ${companyId} not found`);
    }

    await company.update(updateData);
    return company.toJSON();
  }
}
