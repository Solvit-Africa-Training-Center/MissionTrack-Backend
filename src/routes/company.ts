import { CompanyController } from "../controllers/companyController";
import { Router } from "express";
import { uploadCompanyProof } from "../middlewares/uploadFiles";


const companyRouter = Router();

companyRouter.post("/company/register",uploadCompanyProof.single("proofDocument"),CompanyController.createCompany);
companyRouter.get("/company/allCompanies", CompanyController.getAllCompanies);
companyRouter.get("/company/:companyId", CompanyController.getCompanyById);
companyRouter.put("/company/:companyId", uploadCompanyProof.single("proofDocument"),CompanyController.updateCompany);
companyRouter.delete("/company/:companyId", CompanyController.deleteCompany);
companyRouter.patch("/company/block/:companyId", CompanyController.blockAndUnblockCompany);
companyRouter.patch("/company/approveReject/:companyId",CompanyController.approveAndRejectCompany);

export default companyRouter;
