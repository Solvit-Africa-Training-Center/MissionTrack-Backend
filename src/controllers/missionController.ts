import { Request, response, Response } from "express";
import { MissionService } from "../services/mission";
import { ResponseService } from "../utils/response";
import { Mission } from "../database/models/mission";
import { AuthRequest } from "../utils/helper";


const missionService = new MissionService();
export class MissionController {
    static async createMission(req: AuthRequest, res: Response): Promise<Response> {
        try {
               if (!req.user || !req.user.id) {
            return ResponseService({
                res,
                data: null,
                success: false,
                message: "User not authenticated",
                status: 401
            });
        }
            const missionData = req.body;
            const parsedData = {
                id: missionData.id, 
                userId: req.user.id,
                missionTitle: missionData.missionTitle,
                fullName: req.user.fullName,
                startDate: missionData.startDate,
                companyId:  req.user.companyId,
                endDate: missionData.endDate,
                missionDescription: missionData.missionDescription,
                location: missionData.location,
                jobPosition: missionData.jobPosition,
                status: missionData.status||"pending",
                documents: [] as { documentName: string; documentUrl: string }[],
                mission: missionData.mission 
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


    static async getAllMissionsbyEmployee(req: AuthRequest, res: Response): Promise<Response> {
        try {
            if (!req.user || !req.user.id) {
                return ResponseService({
                    res,
                    data: null,
                    success: false,
                    message: "User not authenticated",
                    status: 401
                });
            }
            const missions = await missionService.getAllMissionsbyEmployee(req.user.id);
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
  static async getAllMissionsByManager(req: AuthRequest, res: Response): Promise<Response> {
        try {
            if (!req.user || !req.user.companyId) {
                return ResponseService({
                    res,
                    data: null,
                    success: false,
                    message: "User not authenticated",
                    status: 401
                });
            }
            const missions = await missionService.getAllMissionsByManager(req.user.companyId);
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

 static async getAllMissionsByFinance_manager(req: AuthRequest, res: Response): Promise<Response> {
        try {
            if (!req.user || !req.user.companyId) {
                return ResponseService({
                    res,
                    data: null,
                    success: false,
                    message: "User not authenticated",
                    status: 401
                });
            }
            const missions = await missionService.getAllMissionsByFinance_manager(req.user.companyId);
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
      
        try {
              const updateData = req.body;
            const { id } = req.params;
            if(req.files){
                  const documents = Array.isArray(req.files) ? req.files : [req.files];
                updateData.documents = documents.map(file => ({
                documentName: file.originalname,
                documentUrl: file.path
            }));
        }
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