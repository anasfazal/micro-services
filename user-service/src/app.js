import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import redisClient from './config/redis.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/health', (req, res) => {
  const redisStatus = redisClient.status === 'ready' ? 'connected' : 'disconnected';
  res.json({
    status: 'OK',
    service: 'user-service',
    redis: redisStatus,
    timestamp: new Date().toISOString()
  });
});

app.use(errorHandler);

export default app;