import { Router } from "express";
import { createMissionAction, getActionByMissionId, updateMissionAction,getActionById,deleteAction,getAllActions} from "../controllers/managerActions";

const ActionsRouter=Router();

ActionsRouter.post("/actions/create", createMissionAction);
ActionsRouter.get("/actions", getAllActions);
ActionsRouter.get("/actions/:missionId", getActionByMissionId);
ActionsRouter.get("/actions/action/:actionId", getActionById);
ActionsRouter.patch("/actions/action/:actionId", updateMissionAction);
ActionsRouter.delete("/actions/action/:actionId", deleteAction);

export default ActionsRouter;
