import ExpenseLog from "../database/models/expenseLogs";
import { Mission } from "../database/models/mission";
import { User } from "../database/models/users";
import { ExpenseLogCreate, ExpenseLogUpdate } from "../types/expenseLogs";
import { Mailer } from "../utils/mailer";


export class ExpenseLogService {

    static async createExpenseLog(userId: string, data: ExpenseLogCreate) {
        const mission = await Mission.findByPk(data.missionId);
        if (!mission) {
            throw new Error('Mission not found');
        }
        const user=await User.findByPk(userId);
        if(!user) throw new Error("User not found");
        data.userId=userId;
        // Ensure the user creating the expense log is the owner of the mission
        if (mission.userId !== data.userId) {
            throw new Error('You are not authorized to create a expense report for this mission');
        }

        //    dealing with amounts
        const accommodationAmount = data.accommodationAmount ?? 0;
        const mealsAmount = data.mealsAmount ?? 0;
        const transportAmount = data.transportAmount ?? 0;
        data.totalAmount = accommodationAmount + mealsAmount + transportAmount;

        const Elog = await ExpenseLog.create({ ...data, userId });
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

        //    dealing with amounts
        if (typeof data.accommodationAmount !== "undefined" || typeof data.mealsAmount !== "undefined" || typeof data.transportAmount !== "undefined") {
            const acc = data.accommodationAmount ?? (Elog.get("accommodationAmount") as number) ?? 0;
            const meals = data.mealsAmount ?? (Elog.get("mealsAmount") as number) ?? 0;
            const trans = data.transportAmount ?? (Elog.get("transportAmount") as number) ?? 0;
            data.totalAmount = acc + meals + trans;
        }

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
    static async changeExpenseLogStatus(id:string,status:"pending" | "accepted" | "rejected",statusChangeComment?:string|null){
        const Elog = await ExpenseLog.findByPk(id);
        if (!Elog) throw new Error("Expense Log not found");
        await Elog.update({status,statusChangeComment});
         const user = await User.findByPk(Elog.userId);
         if(user){
         const subject = `Your expense log has been ${status}`;
         const message = `Your expense log uploaded document was reviewed. Status: ${status.toUpperCase()}`;
        await Mailer.notifyEmpForExpenseStatus(user.email, user.fullName, subject, message, statusChangeComment || "");
        return Elog;
    }
}

}