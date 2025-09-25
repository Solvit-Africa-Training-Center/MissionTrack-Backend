import { Router } from "express";
import { createMissionAction, getActionByMissionId, updateMissionAction,getActionById,deleteAction,getAllActions} from "../controllers/managerActions";
import { checkRoleMiddleware } from "../middlewares/checkRoleMiddleware";

const ActionsRouter=Router();

ActionsRouter.post("/actions/create",checkRoleMiddleware(["manager"]), createMissionAction);
ActionsRouter.get("/actions",checkRoleMiddleware(["manager"]), getAllActions);
ActionsRouter.get("/actions/:missionId",checkRoleMiddleware(["manager"]), getActionByMissionId);
ActionsRouter.get("/actions/action/:actionId",checkRoleMiddleware(["manager"]), getActionById);
ActionsRouter.patch("/actions/action/:actionId",checkRoleMiddleware(["manager"]), updateMissionAction);
ActionsRouter.delete("/actions/action/:actionId",checkRoleMiddleware(["manager"]), deleteAction);

export default ActionsRouter;
