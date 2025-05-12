import redisClient from '../config/redis.js';
import { HTTP_STATUS_CODES } from '../utils/statusCodes.js';

export const cacheMiddleware = (resourceType) => {
  return async (req, res, next) => {
    const cacheKey = `${resourceType}:${req.originalUrl}`;
    
    try {
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return res.status(HTTP_STATUS_CODES.OK).json({
          status: HTTP_STATUS_CODES.OK,
          fromCache: true,
          data: JSON.parse(cachedData)
        });
      }

      const originalJson = res.json;
      res.json = (body) => {
        redisClient.setex(cacheKey, 
          resourceType === 'products' ? 3600 : 1800,
          JSON.stringify(body.data)
        );
        originalJson.call(res, body);
      };
      
      next();
    } catch (err) {
      console.error('Cache error:', err);
      next();
    }
  };
};