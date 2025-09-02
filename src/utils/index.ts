// import express from 'express'
// import {config} from 'dotenv'
// import redis from './utils/redis';
// import { errorLogger, logStartup } from './utils/logger';
// import { database } from './database';
// import i18n from './config/i18n';
// import userRoutes from './routes';

// config();

// const app=express();
// // app.use((req,res,next)=>{
// //     requestLogger(req);
// //     next();
// // });

// app.use(express.json());
// app.use(i18n.init);
// redis.connect().catch((err)=>console.log("Redis connection error",err));

// // Health check endpoint
// app.get('/health', (req, res) => {
//   res.status(200).json({ 
//     status: 'OK', 
//     message: 'Mission Track Backend is running',
//     timestamp: new Date().toISOString()
//   });
// });

// // API Routes
// app.use('/api/users', userRoutes);

// // 404 handler
// app.use('/*', (req, res) => {
//   res.status(404).json({ 
//     success: false, 
//     message: 'Route not found' 
//   });
// });

// // Error handling middleware
// app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
//   errorLogger(error, 'Unhandled Error');
//   res.status(500).json({ 
//     success: false, 
//     message: 'Internal server error' 
//   });
// });

// const PORT=parseInt(process.env.PORT as string)||5500;

// database.sequelize.authenticate().then(async()=>{
//     try{
//         app.listen(PORT,()=>{
//             logStartup(PORT,process.env.NODE_ENV||'DEV');
//         });
//     } catch(error){
//         errorLogger(error as Error,'Error starting server');
//     }
// }).catch((error:Error)=>{
//     errorLogger(error,'Database connection error');
// })
// export default app;