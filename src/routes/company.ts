import { CompanyController } from "../controllers/companyController";
import { RequestHandler } from "express";
import { Router } from "express";
import { uploadCompanyLogo, uploadCompanyProof } from "../middlewares/uploadFiles";
import { checkRoleMiddleware } from "../middlewares/checkRoleMiddleware";
import { approveRejectCompanySchema, blockUnblockCompanySchema, companySchema, updateCompanySchema } from "../schemas/companySchema";
import { validationMiddleware } from "../middlewares/validationMiddleware";
import { authenticate } from "../middlewares/authMiddleware";


const companyRouter = Router();

companyRouter.post("/company/register", uploadCompanyProof.single("proofDocument"),validationMiddleware({type:"body",schema:companySchema}),CompanyController.createCompany);
companyRouter.get("/company/allCompanies",authenticate,checkRoleMiddleware(["admin"]),CompanyController.getAllCompanies);
companyRouter.patch("/company/profile", authenticate,checkRoleMiddleware(["manager"]), uploadCompanyLogo.single("companyLogo"),CompanyController.updateCompanyProfile as unknown as RequestHandler);
companyRouter.get("/company/:companyId", authenticate,checkRoleMiddleware(["admin"]),CompanyController.getCompanyById);
companyRouter.put("/company/:companyId", authenticate,checkRoleMiddleware(["admin"]), uploadCompanyProof.single("proofDocument"), validationMiddleware({type:"body",schema:updateCompanySchema}), CompanyController.updateCompany);
companyRouter.delete("/company/:companyId", authenticate,checkRoleMiddleware(["admin"]), CompanyController.deleteCompany);
companyRouter.patch("/company/block/:companyId",authenticate,checkRoleMiddleware(["admin"]), validationMiddleware({type:"body",schema:blockUnblockCompanySchema}), CompanyController.blockAndUnblockCompany);
companyRouter.patch("/company/approveReject/:companyId",authenticate,checkRoleMiddleware(["admin"]),validationMiddleware({type:"body",schema:approveRejectCompanySchema}), CompanyController.approveAndRejectCompany);


export default companyRouter;