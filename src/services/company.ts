import { Company } from "../database/models/company";
import { User } from "../database/models/users";
import { ApproveRejectData, BlockUnblockCompany, CompanyAttributes, CompanyManager } from "../types/companyInterface";
import bcrypt from "bcrypt";


export class CompanyService{
     static async createCompany(companyData:CompanyAttributes,userData:CompanyManager){
        const company=await Company.create(companyData);
          const hashedPassword = await bcrypt.hash(userData.password, 10);
        await User.create({
            ...userData,
            password:hashedPassword,
            companyId:company.id,
            role:"manager"
        });
        return company;
    }
     static  async getCompanyById(companyId:string){
        const company=await Company.findByPk(companyId);
        if(!company) throw new Error('Company not found');
        return company;
    }
  static  async updateCompany(companyId:string,data:Partial<CompanyAttributes>){
        const company=await Company.findByPk(companyId);
        if(!company)throw new Error('Company not Found');
        await company.update(data);
        return company;
    }

  static  async getAllCompanies(){
        const companies=await Company.findAll();
        return companies;
    }
  static  async deleteCompany(companyId:string){
        const company=await Company.findByPk(companyId);
        if(!company) throw new Error("Company not found");
        await User.destroy({where:{companyId:company.id}});
        await company.destroy();
        return { message: "Company deleted successfully" };
    }
    static async blockAndUnblockCompany(companyId:string,data:BlockUnblockCompany){
      const company=await Company.findByPk(companyId);
      if(!company) throw new Error("Company not found");
    const newState= await company.update({state:data.state,blockUnblockComment:data.comment});
      return newState;
    }

    static async approveAndRejectCompany(companyId:string,data:ApproveRejectData){
      const company=await Company.findByPk(companyId);
      if(!company) throw new Error("Company not found");
     const newStatus= await company.update({status:data.status,approveComment:data.comment});
      return newStatus;
    }
}