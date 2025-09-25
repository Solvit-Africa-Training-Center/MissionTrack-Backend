import  { Router } from 'express';
import { dailyReportController } from '../controllers/dailyReport';
import { uploadDailyReport } from '../middlewares/uploadFiles';
import { checkRoleMiddleware } from '../middlewares/checkRoleMiddleware';
 const dailyRoutes=Router()

dailyRoutes.post('/reports/', uploadDailyReport.single('document'), checkRoleMiddleware(["employee"]),dailyReportController.createDailyReport);
dailyRoutes.get('/reports/mission/:missionId',checkRoleMiddleware(["employee","manager"]), dailyReportController.getDailyReportsByMissionId);
dailyRoutes.get('/reports/',checkRoleMiddleware(["employee","manager"]), dailyReportController.getAllDailyReports);
dailyRoutes.get('/reports/:id',checkRoleMiddleware(["employee","manager"]), dailyReportController.getDailyReportById);
dailyRoutes.patch('/reports/:id', checkRoleMiddleware(["employee"]),uploadDailyReport.single('document'), dailyReportController.updateDailyReport);
dailyRoutes.delete('/reports/:id', checkRoleMiddleware(["manager"]),dailyReportController.deleteDailyReport);

export default dailyRoutes;