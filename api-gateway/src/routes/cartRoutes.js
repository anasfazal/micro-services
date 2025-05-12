import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { authenticate } from '../middleware/auth.js';

const router = Router();

const cartServiceProxy = createProxyMiddleware({
  target: 'http://localhost:5003',
  changeOrigin: true,
  pathRewrite: { '^/api/cart': '/' },
  onProxyReq: (proxyReq, req) => {
    if (req.user) {
      proxyReq.setHeader('X-User-Id', req.user.id);
    }
  }
});

router.use(authenticate);
router.post('/', cartServiceProxy);
router.get('/', cartServiceProxy);
router.put('/:productId', cartServiceProxy);
router.delete('/:productId', cartServiceProxy);

export default router;