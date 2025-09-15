import MissionActionService from "../services/managerMissionActions";
import { Request,Response } from "express";
import { CreateMissionActionParams, UpdateMissionActionParams } from "../types/managerMissionActions";
import { ResponseService } from "../utils/response";

const missionActionService = new MissionActionService();

export const createMissionAction = async (req: Request, res: Response) => {
    const params: CreateMissionActionParams = req.body;
    try {
        const result = await missionActionService.createActionAndUpdateMission(params);
        return ResponseService
        ({
            res,
            data:result,
            message: "Action created and mission status updated successfully",
            success:true,
            status:201
        })
    } catch (error:any) {
         console.error("Error creating action:", error);
        return ResponseService({
            res,
            data:null,
            message:(error.message) || "Change action failed",
            success:false,
            status:500
        })
    }
};

export const updateMissionAction = async (req: Request, res: Response) => {
    const actionId: string = req.params.actionId;
    const params: UpdateMissionActionParams = req.body;
    try {
        const result = await missionActionService.updateAction(actionId, params);
        return ResponseService({
            res,
            data:result,
            success:true,
            status:201,
            message:"Updated success"
        })
    } catch (error) {
        return ResponseService({
            res,
            data:null,
            success:false,
            status:500,
            message:"Failed to update"
        })
    }};
export const getActionByMissionId = async (req: Request, res: Response) => {
    const missionId: string = req.params.missionId;
    try {
        const result = await missionActionService.getActionByMissionId(missionId);
        return ResponseService({
            res,
            data:result,
            success:true,
            status:200,
            message:"Action retrieved"
        })
    } catch (error) {
        return ResponseService({
            res,
            data:null,
            success:false,
            status:500,
            message:"Failed to retrieve action"
        })
    }   }
export const getAllActions = async (req: Request, res: Response) => {
    try {
        const result = await missionActionService.getAllActions();
        return ResponseService({
            res,
            data:result,
            success:true,
            status:200,
            message:"Actions retrieved"
        })
    } catch (error) {
        return ResponseService({
            res,
            data:null,
            success:false,
            status:500,
            message:"Failed to retrieve actions"
        })
    }   }
    
    export const deleteAction = async (req: Request, res: Response) => {
    const actionId: string = req.params.actionId;
    try {
        await missionActionService.deleteAction(actionId);
        return ResponseService({
            res,
            data:null,
            success:true,
            status:200,
            message:"Action deleted"
        })
    } catch (error) {
        return ResponseService({
            res,
            data:null,
            success:false,
            status:500,
            message:"Failed to delete action"
        })
    }   }
    export const getActionById = async (req: Request, res: Response) => {
    const actionId: string = req.params.actionId;
    try {
        const result = await missionActionService.getActionById(actionId);
        return ResponseService({
            res,
            data:result,
            success:true,
            status:200,
            message:"Action retrieved"
        })
    } catch (error) {
        return ResponseService({
            res,
            data:null,
            success:false,
            status:500,
            message:"Failed to retrieve action"
        })
    }   }
