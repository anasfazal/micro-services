import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { globalRateLimiter } from './middleware/rateLimiter.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(globalRateLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);


app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    services: {
      auth: 'http://localhost:5001',
      users: 'http://localhost:5001',
      products: 'http://localhost:5002',
      cart: 'http://localhost:5003'
    },
    timestamp: new Date().toISOString()
  });
});

app.use(errorHandler);

export default app;