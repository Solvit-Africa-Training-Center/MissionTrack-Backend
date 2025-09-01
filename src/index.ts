import express from 'express'
import {config} from 'dotenv'
import redis from './utils/redis';
import { errorLogger, logStartup } from './utils/logger';
import { database } from './database';
import i18n from './config/i18n';
import { routers } from './routes';
import { setupSwagger } from './swagger/swagger';

config();

const app=express();
// app.use((req,res,next)=>{
//     requestLogger(req);
//     next();
// });

app.use(express.json());
app.use(i18n.init);

app.use(routers);
setupSwagger(app);
redis.connect().catch((err)=>console.log("Redis connection error",err));
const PORT=parseInt(process.env.PORT as string)||5000;

database.authenticate().then(async()=>{
    try{
        app.listen(PORT,()=>{
            logStartup(PORT,process.env.NODE_ENV||'DEV');
        });
    } catch(error){
        errorLogger(error as Error,'Error starting server');
    }
}).catch((error:Error)=>{
    errorLogger(error,'Database connection error');
})
export default app;