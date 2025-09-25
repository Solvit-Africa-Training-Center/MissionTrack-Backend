import { Router } from 'express';
import userRouter from './userRouters';
import { missionRoutes } from './missionRoutes';
import dailyRoutes from './dailyReport';
import expenseLogRoutes from './expenseLogs';
import ActionsRouter from './managerActios';
import companyRouter from './company';
import authRouter from './authRoutes';



const routers = Router();
const allRoutes=[userRouter,missionRoutes,dailyRoutes,expenseLogRoutes,ActionsRouter,companyRouter,authRouter];
routers.use('/api',...allRoutes);

export { routers };
