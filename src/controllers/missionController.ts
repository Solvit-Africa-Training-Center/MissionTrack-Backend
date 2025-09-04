import { Request, response, Response } from "express";
import { MissionService } from "../services/mission";
import { ResponseService } from "../utils/response";
import { Mission } from "../database/models/mission";


const missionService = new MissionService();
export class MissionController {
    static async createMission(req: Request, res: Response): Promise<Response> {
        try {
            const missionData = req.body;
            console.log("Raw of data", missionData);
            const parsedData = {
                title: missionData.title,
                description: missionData.description,
                location: missionData.location,
                jobPosition: missionData.jobPosition,
                status: missionData.status,
                budget: {
                    estimatedTransportCost: parseFloat(missionData.estimatedTransportCost),
                    estimatedAccommodationCost: parseFloat(missionData.estimatedAccommodationCost),
                    estimatedMealCost: parseFloat(missionData.estimatedMealCost),
                    totalAmount: parseFloat(missionData.totalAmount)
                },
              documents: [] as { documentName: string; documentUrl: string }[]

            };
              if (req.files && Array.isArray(req.files)) {
            for (const file of req.files as any[]) {
                parsedData.documents.push({
                    documentName: file.originalname,
                    documentUrl: `http://localhost:5000/uploads/${file.filename}` 
                });
            }
        }

            const mission = await Mission.findOne({ where: { location: parsedData.location } });
            if (mission) {
                return ResponseService({
                    message: "You have arleady mission in that location",
                    res,
                    status: 400,
                    data: mission,
                    success: false
                })
            }
            const newMission = await missionService.createMission(parsedData);
            return ResponseService({
                message: "Mission created successfully",
                data: newMission,
                success: true,
                status: 200,
                res
            })
        } catch (error) {
            const { message, stack } = error as Error;
            return ResponseService({
                data: stack,
                status: 500,
                success: false,
                message: message,
                res
            })

        }
    }


    static async getAllMissions(req: Request, res: Response): Promise<Response> {
        try {
            const missions = await missionService.getAllMissions();
            return ResponseService({
                res,
                data: missions,
                success: true,
                message: "All missions retrieved",
                status: 200
            })
        } catch (error) {
            const { message, stack } = error as Error;
            return ResponseService({
                data: stack,
                status: 500,
                success: false,
                message: message,
                res
            })
        }
    }

    static async getSingleMissionById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
            const mission = await Mission.findByPk(id);
            if (!mission) {
                return ResponseService({
                    data: null,
                    res,
                    message: "Mission not found",
                    success: false,
                    status: 400
                })
            }
            const fetchedMission = await missionService.getMissionById(id);
            return ResponseService({
                res,
                data: fetchedMission,
                success: true,
                status: 200,
                message: "Successfull mission fetched"
            })
        } catch (error) {
            const { message, stack } = error as Error;
            return ResponseService({
                data: stack,
                status: 500,
                success: false,
                message: message,
                res
            })
        }
    }
    static async updateMission(req: Request, res: Response): Promise<Response> {
        const updateData = req.body;
        const { id } = req.params;
        try {
            const missionFound = await Mission.findByPk(id);
            if (!missionFound) {
                return ResponseService({
                    res,
                    data: null,
                    message: "Mission not Found",
                    success: false,
                    status: 400
                })
            }

            const updateMission = await missionService.updateMission(id, updateData);
            return ResponseService({
                res,
                data: updateMission,
                status: 200,
                message: "Update successfull",
                success: true
            })

        } catch (error) {
            const { message, stack } = error as Error;
            return ResponseService({
                data: stack,
                status: 500,
                success: false,
                message: message,
                res
            })
        }
    }


    static async deleteMission(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
            const mission = await Mission.findByPk(id);
            if (!mission) {
                return ResponseService({
                    data: null,
                    res,
                    message: "Mission not found",
                    success: false,
                    status: 400
                })
            }

            const deleteMission = await missionService.deleteMission(id);
            return ResponseService({
                data: null,
                res,
                status: 200,
                success: true,
                message: "Mission deleted successfully"
            })
        } catch (error) {
            const { message, stack } = error as Error;
            return ResponseService({
                data: stack,
                status: 500,
                success: false,
                message: message,
                res
            })

        }


    }
}