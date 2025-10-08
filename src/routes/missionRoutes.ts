import { Router } from "express";
import { MissionController } from "../controllers/missionController";
import { uploadMissionFiles } from "../middlewares/uploadFiles";
import { checkRoleMiddleware } from "../middlewares/checkRoleMiddleware";
import { authenticate } from "../middlewares/authMiddleware";

export const missionRoutes=Router();

missionRoutes.post("/missions",authenticate,uploadMissionFiles.array("documents"),checkRoleMiddleware(["employee"]),MissionController.createMission);
missionRoutes.get("/missions/employee",authenticate,checkRoleMiddleware(["employee"]),MissionController.getAllMissionsbyEmployee);
missionRoutes.get("/missions/manager",authenticate,checkRoleMiddleware(["manager"]),MissionController.getAllMissionsByManager);
missionRoutes.get("/missions/finance-manager",authenticate,checkRoleMiddleware(["finance_manager"]),MissionController.getAllMissionsByFinance_manager);
missionRoutes.get("/missions/:id",authenticate,checkRoleMiddleware(["manager"]),MissionController.getSingleMissionById);
missionRoutes.patch('/missions/:id',authenticate, uploadMissionFiles.array('documents'), checkRoleMiddleware(["employee"]),MissionController.updateMission);
missionRoutes.delete("/missions/:id",checkRoleMiddleware(["manager","employee"]),MissionController.deleteMission);

