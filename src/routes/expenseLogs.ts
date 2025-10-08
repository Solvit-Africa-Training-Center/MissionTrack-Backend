import { Router } from "express";
import { ExpenseLogController } from "../controllers/ExpenseLogs";
import upload from "../middlewares/uploadExpenseFiles";
import { checkRoleMiddleware } from "../middlewares/checkRoleMiddleware";
import { authenticate } from "../middlewares/authMiddleware";


const expenseLogRoutes=Router()

expenseLogRoutes.post("/expenselog",authenticate, upload,checkRoleMiddleware(["employee"]),ExpenseLogController.createExpenseLog);
expenseLogRoutes.get("/expenselog/:id",authenticate,checkRoleMiddleware(["employee","manager"]), ExpenseLogController.getExpenseLogById);
expenseLogRoutes.patch("/expenselog/:id",authenticate, upload,checkRoleMiddleware(["employee"]),ExpenseLogController.updateExpenseLog);
expenseLogRoutes.delete("/expenselog/:id",authenticate,checkRoleMiddleware(["employee","manager"]), ExpenseLogController.deleteExpenseLog);
expenseLogRoutes.get("/expenselogs",authenticate,checkRoleMiddleware(["employee","manager"]), ExpenseLogController.getAllExpenseLogs);
expenseLogRoutes.get("/expenselogs/mission/:missionId",authenticate,checkRoleMiddleware(["manager","employee"]), ExpenseLogController.getExpenseLogsByMissionId);
expenseLogRoutes.patch("/expenselog/status/:id",authenticate,checkRoleMiddleware(["finance_manager"]), ExpenseLogController.changeExpenseLogStatus);

export default expenseLogRoutes;