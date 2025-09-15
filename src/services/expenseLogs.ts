import ExpenseLog from "../database/models/expenseLogs";
import { ExpenseLogCreate, ExpenseLogUpdate, IExpenseLog } from "../types/expenseLogs";


export class ExpenseLogService {

    static async createExpenseLog(data: ExpenseLogCreate) {
        const Elog = await ExpenseLog.create(data);
        return Elog;
    }
    static async getExpenseLogById(id: string) {
        const Elog = await ExpenseLog.findByPk(id);
        if (!Elog) throw new Error('Expense Log not found');
        return Elog;
    }
    static async updateExpenseLog(id: string, data: ExpenseLogUpdate) {
        const Elog = await ExpenseLog.findByPk(id);
        if (!Elog) throw new Error("Expense LOg not found");
        await Elog.update(data);
        return Elog;
    }
    static async deleteExpenseLog(id: string) {
        const Elog = await ExpenseLog.findByPk(id);
        if (!Elog) throw new Error("Expense Log not found");
        await Elog.destroy();
    }
    static async getAllExpenseLogs() {
        const Elogs = await ExpenseLog.findAll();
        return Elogs;

    }
    static async getExpenseLogsByMissionId(missionId: string) {
        const Elog = await ExpenseLog.findAll({ where: { missionId } });
        return Elog;
    }
}