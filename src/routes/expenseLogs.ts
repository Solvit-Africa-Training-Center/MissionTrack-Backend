import { Router } from "express";
import { ExpenseLogController } from "../controllers/ExpenseLogs";
import upload from "../middlewares/uploadExpenseFiles";
import { checkRoleMiddleware } from "../middlewares/checkRoleMiddleware";


const expenseLogRoutes=Router()

expenseLogRoutes.post("/expenselog",upload.fields([{name:"accommodationFile",maxCount:1},{name:"mealsFile",maxCount:1},{name:"transportFile",maxCount:1}]),checkRoleMiddleware(["employee"]),ExpenseLogController.createExpenseLog);
expenseLogRoutes.get("/expenselog/:id",checkRoleMiddleware(["employee","manager"]), ExpenseLogController.getExpenseLogById);
expenseLogRoutes.patch("/expenselog/:id", upload.fields([{name:"accommodationFile",maxCount:1},{name:"mealsFile",maxCount:1},{name:"transportFile",maxCount:1}]), checkRoleMiddleware(["employee"]),ExpenseLogController.updateExpenseLog);
expenseLogRoutes.delete("/expenselog/:id",checkRoleMiddleware(["employee","manager"]), ExpenseLogController.deleteExpenseLog);
expenseLogRoutes.get("/expenselogs",checkRoleMiddleware(["employee","manager"]), ExpenseLogController.getAllExpenseLogs);
expenseLogRoutes.get("/expenselogs/mission/:missionId",checkRoleMiddleware(["manager"]), ExpenseLogController.getExpenseLogsByMissionId);

export default expenseLogRoutes;