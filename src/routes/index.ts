import { Router } from 'express';
import userRouter from './userRouters';
import { missionRoutes } from './missionRoutes';
import dailyRoutes from './dailyReport';
import expenseLogRoutes from './expenseLogs';
import ActionsRouter from './managerActios';
import companyRouter from './company';


const routers = Router();
const allRoutes=[userRouter,missionRoutes,dailyRoutes,expenseLogRoutes,ActionsRouter,companyRouter];
routers.use('/api',...allRoutes);

export { routers };
