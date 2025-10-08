import { Request, RequestHandler, Response } from "express";
import { ExpenseLogService } from "../services/expenseLogs";
import { ExpenseLogCreate, ExpenseLogUpdate } from "../types/expenseLogs";
import { ResponseService } from "../utils/response";
import { AuthRequest, extractReceiptData } from "../utils/helper";
export class ExpenseLogController {
    static async createExpenseLog(req: AuthRequest, res: Response) {
        try {
            const data: ExpenseLogCreate = {
                ...req.body,
                missionId: req.body.missionId,
                userId: req.user?.id ,
            }
            if (!data.userId) {
                return ResponseService({
                    res,
                    status: 400,
                    success: false,
                    message: "User ID is required",
                    data: null
                });
            }
            if (!data.missionId) {
                return ResponseService({
                    res,
                    status: 400,
                    success: false,
                    message: "Mission ID is required",
                    data: null
                });
            }

            const files = req.files as { [key: string]: Express.Multer.File[] } | undefined;
            if (files) {
                if (files.accommodationFile?.[0]) {
                    const file = files.accommodationFile[0];
                    data.accommodationFile = (file as any).path || (file as any).location || file.path;
                    if (data.accommodationFile) {
                        const result = await extractReceiptData(data.accommodationFile);
                        if (result.amount) data.accommodationAmount = result.amount;
                        if (result.date && !data.date) data.date = result.date;
                    }
                }
                if (files.mealsFile?.[0]) {
                    const file = files.mealsFile[0];
                    data.mealsFile = (file as any).path || (file as any).location || file.path;
                    if (data.mealsFile) {
                        const result = await extractReceiptData(data.mealsFile);
                        if (result.amount) data.mealsAmount = result.amount;
                        if (result.date && !data.date) data.date = result.date;
                    }
                }
                if (files.transportFile?.[0]) {
                    const file = files.transportFile[0];
                    data.transportFile = (file as any).path || (file as any).location || file.path;

                    if (data.transportFile) {
                        const result = await extractReceiptData(data.transportFile);
                        if (result.amount) data.transportAmount = result.amount;
                        if (result.date && !data.date) data.date = result.date;
                    }
                }
            }
            const Elog = await ExpenseLogService.createExpenseLog(data.userId, data);
            return ResponseService({
                res,
                status: 201,
                success: true,
                message: "Expense log created successfully",
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
    // Fixed updateExpenseLog method
    static async updateExpenseLog(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const existingElog = await ExpenseLogService.getExpenseLogById(id);
            if (!existingElog) {
                return ResponseService({
                    res,
                    status: 404,
                    success: false,
                    message: "Expense Log not found",
                    data: null,
                });
            }

            const updateData: ExpenseLogUpdate = { ...req.body, ...existingElog.toJSON() };
            const files = req.files as { [key: string]: Express.Multer.File[] } | undefined;

            if (files) {
                if (files.accommodationFile?.[0]) {
                    updateData.accommodationFile = files.accommodationFile[0].path;
                    try {
                        const result = await extractReceiptData(updateData.accommodationFile);
                        if (result.amount) updateData.accommodationAmount = result.amount;
                        if (result.date && !updateData.date) updateData.date = result.date;
                    } catch (error) {
                        console.error("Error extracting data from accommodation file:", error);
                    }
                }
                if (files.mealsFile?.[0]) {
                    updateData.mealsFile = files.mealsFile[0].path;
                    try {
                        const result = await extractReceiptData(updateData.mealsFile);
                        if (result.amount) updateData.mealsAmount = result.amount;
                        if (result.date && !updateData.date) updateData.date = result.date;
                    } catch (error) {
                        console.error("Error extracting data from meals file:", error);
                    }
                }
                if (files.transportFile?.[0]) {
                    updateData.transportFile = files.transportFile[0].path;
                    try {
                        const result = await extractReceiptData(updateData.transportFile);
                        if (result.amount) updateData.transportAmount = result.amount;
                        if (result.date && !updateData.date) updateData.date = result.date;
                    } catch (error) {
                        console.error("Error extracting data from transport file:", error);
                    }
                }
            }

            // Clean empty/undefined values
            for (const key in updateData) {
                if (
                    updateData[key as keyof ExpenseLogUpdate] === "" ||
                    updateData[key as keyof ExpenseLogUpdate] === undefined
                ) {
                    delete updateData[key as keyof ExpenseLogUpdate];
                }
            }

            const updatedElog = await ExpenseLogService.updateExpenseLog(id, updateData);
            return ResponseService({
                res,
                status: 200,
                success: true,
                message: "Expense Log updated successfully",
                data: updatedElog,
            });
        } catch (error) {
            return ResponseService({
                res,
                status: 500,
                success: false,
                message: (error as Error).message,
                data: null,
            });
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
    static async changeExpenseLogStatus(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const { status, statusChangeComment } = req.body as { status: "pending" | "accepted" | "rejected", statusChangeComment?: string | null };
            const updatedElog = await ExpenseLogService.changeExpenseLogStatus(id, status, statusChangeComment);
            return ResponseService({
                res,
                status: 200,
                success: true,
                message: "Expense Log status updated successfully",
                data: updatedElog
            })
        }
        catch (error) {
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