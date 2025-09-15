import { Router } from "express";
import { MissionController } from "../controllers/missionController";
import { uploadMissionFiles } from "../middlewares/uploadFiles";

export const missionRoutes=Router();

missionRoutes.post("/missions",uploadMissionFiles.array("documents"),MissionController.createMission);
missionRoutes.get("/missions",MissionController.getAllMissions);
missionRoutes.get("/missions/:id",MissionController.getSingleMissionById);
missionRoutes.patch("/missions/:id",uploadMissionFiles.array("documents"),MissionController.updateMission);
missionRoutes.delete("/missions/:id",MissionController.deleteMission);

