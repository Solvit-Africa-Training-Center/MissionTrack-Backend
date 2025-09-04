import { Router } from "express";
import { MissionController } from "../controllers/missionController";
import upload from "../middlewares/uploadFiles";

export const missionRoutes=Router();

missionRoutes.post("/missions",upload.array("documents"),MissionController.createMission);
missionRoutes.get("/missions",MissionController.getAllMissions);
missionRoutes.get("/missions/:id",MissionController.getSingleMissionById);
missionRoutes.patch("/missions/:id",MissionController.updateMission);
missionRoutes.delete("/missions/:id",MissionController.deleteMission);

