import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import redisClient from './config/redis.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);

app.get('/health', (req, res) => {
  const redisStatus = redisClient.status === 'ready' ? 'connected' : 'disconnected';
  res.json({
    status: 'OK',
    service: 'product-service',
    redis: redisStatus,
    timestamp: new Date().toISOString()
  });
});

app.use(errorHandler);

export default app;