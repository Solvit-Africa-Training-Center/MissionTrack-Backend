import { createClient } from 'redis';
import { config } from 'dotenv';

config();

const redisUrl = process.env.REDIS_URL || 
  'redis://default:VmEgzwJ2LZeg02ytx6upTqquPcBdiU14@redis-18217.c8.us-east-1-3.ec2.redns.redis-cloud.com:18217';

export const redis = createClient({
  url: redisUrl,
});

export default redis;

