import { CompanyController } from "../controllers/companyController";
import { RequestHandler } from "express";
import { Router } from "express";
import { uploadCompanyLogo, uploadCompanyProof } from "../middlewares/uploadFiles";
import { checkRoleMiddleware } from "../middlewares/checkRoleMiddleware";


const companyRouter = Router();

companyRouter.post("/company/register",uploadCompanyProof.single("proofDocument"),CompanyController.createCompany);
companyRouter.get("/company/allCompanies",checkRoleMiddleware(["admin"]),CompanyController.getAllCompanies);
companyRouter.patch("/company/profile", checkRoleMiddleware(["manager"]), uploadCompanyLogo.single("companyLogo"),CompanyController.updateCompanyProfile as unknown as RequestHandler);
companyRouter.get("/company/:companyId", checkRoleMiddleware(["admin"]),CompanyController.getCompanyById);
companyRouter.put("/company/:companyId", checkRoleMiddleware(["admin"]), uploadCompanyProof.single("proofDocument"),CompanyController.updateCompany);
companyRouter.delete("/company/:companyId",checkRoleMiddleware(["admin"]), CompanyController.deleteCompany);
companyRouter.patch("/company/block/:companyId",checkRoleMiddleware(["admin"]), CompanyController.blockAndUnblockCompany);
companyRouter.patch("/company/approveReject/:companyId",checkRoleMiddleware(["admin"]),CompanyController.approveAndRejectCompany);


export default companyRouter;