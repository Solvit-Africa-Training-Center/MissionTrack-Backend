
import DailyReport from "../database/models/dailyReport";
import { Mission } from "../database/models/mission";
import { User } from "../database/models/users";
import { DailyReportCreate, DailyReportUpdate } from "../types/mDailReport";

export class DailyReportService {
    async createDailyReport(userId:string,data: DailyReportCreate) {

        const user = await User.findByPk(userId);
        if(!user) throw new Error("User not found");

         const mission = await Mission.findByPk(data.missionId);
         if(!mission) throw new Error ("Misson not found");

         if(mission.userId!==userId) throw new Error("You are not own of the mission");
         const report = await DailyReport.create({...data,userId});
         return report;

    }
    
    async getDailyReportById(id:string) {
        const report = await DailyReport.findByPk(id);
        if (!report)
            throw new Error('Daily Report not found');
        return report;
    }
    
    async updateDailyReport(id: string, data: DailyReportUpdate) {
        const report = await DailyReport.findByPk(id);
        if (!report)
            throw new Error('Daily Report not found');
        await report.update(data);
        return report;
    }

    async deleteDailyReport(id: string): Promise<void> {
        const report = await DailyReport.findByPk(id);
        if (!report)
            throw new Error('Daily report not found');
        await report.destroy();
    }
    
    async getAllDailyReports(){
        const reports = await DailyReport.findAll();
        return reports;
    }
    
    async getDailyReportsByMissionId(missionId:string){
        const reports = await DailyReport.findAll({
            where: { missionId }
        });
        return reports;
    }
}

export const dailyReportService = new DailyReportService();