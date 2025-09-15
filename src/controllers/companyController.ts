import { Request,Response } from "express";
import { CompanyService } from "../services/company";
import { ResponseService } from "../utils/response";
import { Company } from "../database/models/company";
import { Op } from "sequelize";



export class CompanyController{
   static async createCompany(req:Request,res:Response){
        try {
            const companyData={...req.body,proofDocument: req.file ? req.file.path : null,};
            const userData=req.body;
            const existCompany=await Company.findOne({where:{[Op.or]:{companyEmail:companyData.companyEmail,companyName:companyData.companyName}}});
            if(existCompany){
                return ResponseService({
                    res,
                    status:400,
                    success:false,
                    message:"Company already Registered",
                    data:null
                })
            }
            const newCompany=await CompanyService.createCompany(companyData,userData);
            return ResponseService({
                res,
                status:201,
                success:true,
                message:"Company created successfully",
                data:newCompany
            })
        } catch (error) {
            return ResponseService({
                res,
                status:500,
                success:false,
                message:(error as Error).message,
                data:null
            })
        }
    }
  static async getCompanyById(req:Request,res:Response){
        try {
            const {companyId}=req.params;
            const checkCompany=await CompanyService.getCompanyById(companyId);
            return ResponseService({
                res,
                status:200,
                success:true,
                message:"Company fetched successfully",
                data:checkCompany
            })

            
        } catch (error) {
            return ResponseService({
                res,
                status:500,
                success:false,
                message:(error as Error).message,
                data:null
            })
        }
     };

   static  async updateCompany(req:Request,res:Response){
        try {
            const {companyId}=req.params;
            const updateData=req.body;
            const updatedCompany=await CompanyService.updateCompany(companyId,updateData);
            return ResponseService({
                res,
                status:200,
                success:true,
                message:"Company updated successfully",
                data:updatedCompany
            })
            
        } catch (error) {
            return ResponseService({
                res,
                status:500,
                success:false,
                message:(error as Error).message,
                data:null
            })
            
        }
     };
   static  async getAllCompanies(req:Request,res:Response){
        try {
            const allCompanies = await CompanyService.getAllCompanies();
            return ResponseService({
                res,
                status: 200,
                success: true,
                message: "All companies fetched successfully",
                data: allCompanies
            });
        } catch (error) {
            return ResponseService({
                res,
                status: 500,
                success: false,
                message: (error as Error).message,
                data: null
            });
        }
     };
    static async deleteCompany(req:Request,res:Response){
        try {
            const {companyId}=req.params;
            await CompanyService.deleteCompany(companyId);
            return ResponseService({
                res,
                status:200,
                success:true,
                message:"Company deleted successfully",
                data:null
            })
            
        } catch (error) {
            return ResponseService({
                res,
                status:500,
                success:false,
                message:(error as Error).message,
                data:null
            })
        }
    };
    static async blockAndUnblockCompany(req:Request,res:Response){
        try {
            const {companyId}=req.params;
            const updatedData=req.body;
            const blockedCompany=await CompanyService.blockAndUnblockCompany(companyId,updatedData);
            return ResponseService({
                res,
                status:200,
                success:true,
                message:"Company state successfully",
                data:blockedCompany
            })
        } catch (error) {
            return ResponseService({
                res,
                status:500,
                success:false,
                message:(error as Error).message,
                data:null
            })
            
        }
    }
    static async approveAndRejectCompany(req:Request,res:Response){
        try {
            const {companyId}=req.params;
            const updateData=req.body;
            const updatedCompany=await CompanyService.approveAndRejectCompany(companyId,updateData);
            return ResponseService({
                res,
                status:200,
                success:true,
                message:"Company updated successfully",
                data:updatedCompany
            })
        } catch (error) {
            return ResponseService({
                res,
                status:500,
                success:false,
                message:(error as Error).message,
                data:null
            })
            
        }
    }


}