import { Router } from 'express';
import userRouter from './userRouter';


const routers = Router();
// const allRoutes=[userRouter];
routers.use('/api',userRouter);

export { routers };
