import { RateLimiterRedis } from 'rate-limiter-flexible';
import redisClient from '../config/redis.js';
import { HTTP_STATUS_CODES } from '../utils/statusCodes.js';

const globalLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rl:gateway',
  points: 100,
  duration: 60, // 1 minute
});

const authLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rl:gateway:auth',
  points: 5,
  duration: 10 * 60, // 10 minutes
});

export const globalRateLimiter = async (req, res, next) => {
  try {
    await globalLimiter.consume(req.ip);
    next();
  } catch {
    res.status(HTTP_STATUS_CODES.TooManyRequests).json({
      message: 'Too many requests from this IP, please try again later.'
    });
  }
};

export const authRateLimiter = async (req, res, next) => {
  try {
    await authLimiter.consume(req.ip);
    next();
  } catch {
    res.status(HTTP_STATUS_CODES.TooManyRequests).json({
      message: 'Too many login attempts. Please try again after 10 minutes.'
    });
  }
};