import { Request, Response } from "express";
import { dailyReportService } from "../services/dailyService";
import { DailyReportCreate, DailyReportUpdate } from "../types/mDailReport";
import { ResponseService } from "../utils/response";
import { AuthRequest } from "../utils/helper";

export class DailyReportController {
    async createDailyReport(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return ResponseService({
                    res,
                    status: 400,
                    success: false,
                    message: "User ID is required",
                    data: null
                });
            }
            const reportData: DailyReportCreate = {
                ...req.body,
                userId: userId,
                missionId: req.body.missionId,
            }
            if (req.file) {
                reportData.filePath = req.file.path;
                reportData.documents = req.file.filename;
            }
            const newReport = await dailyReportService.createDailyReport(userId, reportData);

            return ResponseService({
                res,
                status: 201,
                success: true,
                message: "Daily Report created successfully",
                data: newReport
            });
        }
        catch (error: Error | any) {
            return ResponseService({
                res,
                status: 500,
                success: false,
                message: error.message,
                data: null
            });
        }
    }

    async getDailyReportById(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const report = await dailyReportService.getDailyReportById(id);

            return ResponseService({
                res,
                status: 200,
                success: true,
                message: "Daily Report fetched successfully",
                data: report
            });
        } catch (error: any) {
            return ResponseService({
                res,
                status: 500,
                success: false,
                message: error.message,
                data: null
            });
        }
    }

    async updateDailyReport(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const updateData: DailyReportUpdate = req.body;

            if (req.file) {
                updateData.filePath = req.file.path;
                updateData.documents = req.file.filename;
            }
            console.log("Updating report with data:", updateData);
            const updatedReport = await dailyReportService.updateDailyReport(id, updateData);

            return ResponseService({
                res,
                status: 200,
                success: true,
                message: "Daily Report updated successfully",
                data: updatedReport
            });
        } catch (error: any) {
            console.error("Error updating daily report:", error);
            return ResponseService({
                res,
                status: 500,
                success: false,
                message: error.message,
                data: null
            });
        }
    }

    async deleteDailyReport(req: Request, res: Response) {
        try {
            const id = req.params.id;
            await dailyReportService.deleteDailyReport(id);

            return ResponseService({
                res,
                status: 200,
                success: true,
                message: "Daily Report deleted successfully",
                data: null
            });
        } catch (error: any) {
            return ResponseService({
                res,
                status: 500,
                success: false,
                message: error.message,
                data: null
            });
        }
    }

    async getAllDailyReports(req: Request, res: Response) {
        try {
            const reports = await dailyReportService.getAllDailyReports();

            return ResponseService({
                res,
                status: 200,
                success: true,
                message: "All Daily Reports fetched successfully",
                data: reports
            });
        } catch (error: any) {
            return ResponseService({
                res,
                status: 500,
                success: false,
                message: error.message,
                data: null
            });
        }
    }

    async getDailyReportsByMissionId(req: Request, res: Response) {
        try {
            const missionId = req.params.missionId;
            const reports = await dailyReportService.getDailyReportsByMissionId(missionId);
            return ResponseService({
                res,
                status: 200,
                success: true,
                message: "Daily Reports for mission fetched successfully",
                data: reports
            });
        } catch (error: any) {
            return ResponseService({
                res,
                status: 500,
                success: false,
                message: error.message,
                data: null
            });
        }
    }
}

export const dailyReportController = new DailyReportController();