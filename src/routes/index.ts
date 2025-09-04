import { Router } from 'express';
import userRouter from './userRouters';
import { missionRoutes } from './missionRoutes';


const routers = Router();
const allRoutes=[userRouter,missionRoutes];
routers.use('/api',...allRoutes);

export { routers };
