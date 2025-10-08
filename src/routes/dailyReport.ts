import  { Router } from 'express';
import { dailyReportController } from '../controllers/dailyReport';
import { uploadDailyReport } from '../middlewares/uploadFiles';
import { checkRoleMiddleware } from '../middlewares/checkRoleMiddleware';
import { authenticate } from '../middlewares/authMiddleware';
 const dailyRoutes=Router()

dailyRoutes.post('/reports/',authenticate, uploadDailyReport.single('document'), checkRoleMiddleware(["employee"]),dailyReportController.createDailyReport);
dailyRoutes.get('/reports/mission/:missionId',authenticate, checkRoleMiddleware(["employee","manager"]), dailyReportController.getDailyReportsByMissionId);
dailyRoutes.get('/reports/',authenticate, checkRoleMiddleware(["employee","manager"]), dailyReportController.getAllDailyReports);
dailyRoutes.get('/reports/:id',authenticate, checkRoleMiddleware(["employee","manager"]), dailyReportController.getDailyReportById);
dailyRoutes.patch('/reports/:id',authenticate, checkRoleMiddleware(["employee"]),uploadDailyReport.single('document'), dailyReportController.updateDailyReport);
dailyRoutes.delete('/reports/:id',authenticate, checkRoleMiddleware(["manager"]),dailyReportController.deleteDailyReport);

export default dailyRoutes;