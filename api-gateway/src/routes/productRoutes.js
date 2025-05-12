import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

const productServiceProxy = createProxyMiddleware({
  target: 'http://localhost:5002',
  changeOrigin: true,
  pathRewrite: { '^/api/products': '/' }
});

// Public routes
router.get('/', productServiceProxy);
router.get('/:id', productServiceProxy);

// Protected routes
router.use(authenticate);
router.post('/', authorize('seller'), productServiceProxy);
router.put('/:id', authorize('seller'), productServiceProxy);
router.delete('/:id', authorize('seller'), productServiceProxy);

export default router;