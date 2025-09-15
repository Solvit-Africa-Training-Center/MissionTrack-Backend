import  { Router } from 'express';
import { dailyReportController } from '../controllers/dailyReport';
import { uploadDailyReport } from '../middlewares/uploadFiles';
 const dailyRoutes=Router()

dailyRoutes.post('/reports/', uploadDailyReport.single('document'), dailyReportController.createDailyReport);
dailyRoutes.get('/reports/mission/:missionId', dailyReportController.getDailyReportsByMissionId);
dailyRoutes.get('/reports/', dailyReportController.getAllDailyReports);
dailyRoutes.get('/reports/:id', dailyReportController.getDailyReportById);
dailyRoutes.patch('/reports/:id', uploadDailyReport.single('document'), dailyReportController.updateDailyReport);
dailyRoutes.delete('/reports/:id', dailyReportController.deleteDailyReport);

export default dailyRoutes;