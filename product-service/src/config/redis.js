import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  retryStrategy: (times) => Math.min(times * 100, 3000)
});

redisClient.on('connect', () => console.log('Product Service connected to Redis'));
redisClient.on('error', (err) => console.error('Redis error:', err));

export default redisClient;