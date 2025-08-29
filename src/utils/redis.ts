import { config } from 'dotenv';
import {createClient} from 'redis';
import { Config } from 'sequelize';
import { logger } from './logger';
import { error, log } from 'console';


config();

const host=process.env.REDIS_HOST || 'localhost';
const portStr=process.env.REDIS_PORT|| '6379';
const password=process.env.REDIS_PASSWORD ||'';
const dbStr=process.env.REDIS_DB || '1';


const port=Number.isNaN(parseInt(portStr,10))? 6379:parseInt(portStr,10);
const database=Number.isNaN(parseInt(dbStr,10))?1:parseInt(dbStr,10);

// Log the Redis configuration (without sensitive info)
logger.info(`Redis configuration: ${host}:${port}, DB:${database}`);

export const redis=createClient({
    socket:{host,port},password:password,database
})

redis.on('connect',()=>{ logger.info('connected to rredis sucess')});
redis.on('error',(error:Error)=>{logger.error('Redis connection failed')});
redis.on('connecting',()=>{logger.info('connecting to redis....')})

export default redis;