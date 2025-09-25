import { createClient } from "redis";
import { config } from 'dotenv';
import { logger } from "./logger";

config();

const redisUrl = process.env.REDIS_URL || 
  'redis://default:VmEgzwJ2LZeg02ytx6upTqquPcBdiU14@redis-18217.c8.us-east-1-3.ec2.redns.redis-cloud.com:18217';

export const redisClient = createClient({
  url: redisUrl
});

redisClient.on('connect', () => {
  logger.info('✅ RedisClient connected');
});

redisClient.on('error', (err: unknown) => {
  logger.error('Redis Client Error', { error: err });
});

redisClient.on('ready', () => {
  logger.info('✅ RedisClient ready');
});

(async () => {
  try {
    await redisClient.connect();
    logger.info('Redis connected successfully via URL');
  } catch (error) {
    logger.error('Failed to connect to Redis:', { error });
  }
})();