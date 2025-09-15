import { Router } from "express";
import { ExpenseLogController } from "../controllers/ExpenseLogs";
import upload from "../middlewares/uploadExpenseFiles";


const expenseLogRoutes=Router()

expenseLogRoutes.post("/expenselog",upload.fields([{name:"accommodationFile",maxCount:1},{name:"mealsFile",maxCount:1},{name:"transportFile",maxCount:1}]),ExpenseLogController.createExpenseLog);
expenseLogRoutes.get("/expenselog/:id", ExpenseLogController.getExpenseLogById);
expenseLogRoutes.patch("/expenselog/:id", upload.fields([{name:"accommodationFile",maxCount:1},{name:"mealsFile",maxCount:1},{name:"transportFile",maxCount:1}]), ExpenseLogController.updateExpenseLog);
expenseLogRoutes.delete("/expenselog/:id", ExpenseLogController.deleteExpenseLog);
expenseLogRoutes.get("/expenselogs", ExpenseLogController.getAllExpenseLogs);
expenseLogRoutes.get("/expenselogs/mission/:missionId", ExpenseLogController.getExpenseLogsByMissionId);

export default expenseLogRoutes;