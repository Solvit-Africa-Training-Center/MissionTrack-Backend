import { Router } from "express";
import { MissionController } from "../controllers/missionController";
import { uploadMissionFiles } from "../middlewares/uploadFiles";
import { checkRoleMiddleware } from "../middlewares/checkRoleMiddleware";

export const missionRoutes=Router();

missionRoutes.post("/missions",uploadMissionFiles.array("documents"),checkRoleMiddleware(["employee"]),MissionController.createMission);
missionRoutes.get("/missions",checkRoleMiddleware(["manager"]),MissionController.getAllMissions);
missionRoutes.get("/missions/:id",checkRoleMiddleware(["manager"]),MissionController.getSingleMissionById);
missionRoutes.patch('/missions/:id', uploadMissionFiles.array('documents'), checkRoleMiddleware(["employee"]),MissionController.updateMission);
missionRoutes.delete("/missions/:id",checkRoleMiddleware(["manager","employee"]),MissionController.deleteMission);

