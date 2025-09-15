import { Request, RequestHandler, Response } from "express";
import { ExpenseLogService } from "../services/expenseLogs";
import { ExpenseLogCreate, ExpenseLogUpdate } from "../types/expenseLogs";
import { ResponseService } from "../utils/response";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";


export class ExpenseLogController {
    static async createExpenseLog(req: Request, res: Response) {
        try {
            const ExLogsdata: ExpenseLogCreate = {
                ...req.body,
                missionId: req.body.missionId
            }

            if (req.files) {
                const files = req.files as { [fieldname: string]: Express.Multer.File[] };

                if (files.accommodationFile && files.accommodationFile[0]) {
                    ExLogsdata.accommodationFile = files.accommodationFile[0].path;
                }
                if (files.mealsFile && files.mealsFile[0]) {
                    ExLogsdata.mealsFile = files.mealsFile[0].path;
                }
                if (files.transportFile && files.transportFile[0]) {
                    ExLogsdata.transportFile = files.transportFile[0].path;
                }
            }
            Object.keys(ExLogsdata).forEach(
                (key) =>
                    (ExLogsdata as any)[key] === "" || (ExLogsdata as any)[key] === undefined
                        ? delete (ExLogsdata as any)[key]
                        : null
            );
            const newElog = await ExpenseLogService.createExpenseLog(ExLogsdata);
            return ResponseService({
                res,
                status: 201,
                success: true,
                message: "Expense Log created successfully",
                data: newElog
            })

        } catch (error) {
            return ResponseService({
                res,
                status: 500,
                success: false,
                message: (error as Error).message,
                data: null
            })
        }
    }
    static async getExpenseLogById(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const Elog = await ExpenseLogService.getExpenseLogById(id);
            return ResponseService({
                res,
                status: 200,
                success: true,
                message: "Expense log fetched successfully",
                data: Elog
            })
        } catch (error) {
            return ResponseService({
                res,
                status: 500,
                success: false,
                message: (error as Error).message,
                data: null
            })

        }
    }
    static async updateExpenseLog(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const existingElog = await ExpenseLogService.getExpenseLogById(id);
            const updateData: ExpenseLogUpdate = { ...req.body, ...existingElog.toJSON() };
            if (req.files) {
                const files = req.files as { [fieldname: string]: Express.Multer.File[] };
                if (files.accommodationFile && files.accommodationFile[0]) {
                    updateData.accommodationFile = files.accommodationFile[0].path;
                }

                // Handle meals file
                if (files.mealsFile && files.mealsFile[0]) {
                    updateData.mealsFile = files.mealsFile[0].path;
                }
                if (files.transportFile && files.transportFile[0]) {
                    updateData.transportFile = files.transportFile[0].path;
                }
            }
            Object.keys(updateData).forEach(
                (key) =>
                    (updateData as any)[key] === "" || (updateData as any)[key] === undefined
                        ? delete (updateData as any)[key]
                        : null
            );
            const updatedElog = await ExpenseLogService.updateExpenseLog(id, updateData);
            return ResponseService({
                res,
                status: 200,
                success: true,
                message: "Expense Log updated successfully",
                data: updatedElog
            })
        } catch (error) {
            return ResponseService({
                res,
                status: 500,
                success: false,
                message: (error as Error).message,
                data: null
            })
        }
    }
    static async deleteExpenseLog(req: Request, res: Response) {
        try {
            const id = req.params.id;
            await ExpenseLogService.deleteExpenseLog(id);
            return ResponseService({
                res,
                status: 200,
                success: true,
                message: "Expense Log deleted successfully",
                data: null
            })
        } catch (error) {
            return ResponseService({
                res,
                status: 500,
                success: false,
                message: (error as Error).message,
                data: null
            })

        }
    }
    static async getAllExpenseLogs(req: Request, res: Response) {
        try {
            const Elogs = await ExpenseLogService.getAllExpenseLogs();
            return ResponseService({
                res,
                status: 200,
                success: true,
                message: "Expense Logs fetched successfully",
                data: Elogs
            })
        } catch (error) {
            return ResponseService({
                res,
                status: 500,
                success: false,
                message: (error as Error).message,
                data: null
            })
        }
    }
    static async getExpenseLogsByMissionId(req: Request, res: Response) {
        try {
            const missionId = req.params.missionId;
            const Elogs = await ExpenseLogService.getExpenseLogsByMissionId(missionId);
            return ResponseService({
                res,
                status: 200,
                success: true,
                message: "Expense Logs fetched successfully",
                data: Elogs
            })
        } catch (error) {
            return ResponseService({
                res,
                status: 500,
                success: false,
                message: (error as Error).message,
                data: null
            })

        }
    }
}