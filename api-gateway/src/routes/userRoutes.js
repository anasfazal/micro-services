import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

const userServiceProxy = createProxyMiddleware({
  target: 'http://localhost:5001',
  changeOrigin: true,
  pathRewrite: { '^/api/users': '/' },
  onProxyReq: (proxyReq, req) => {
    if (req.user) {
      proxyReq.setHeader('X-User-Id', req.user.id);
      proxyReq.setHeader('X-User-Role', req.user.role);
    }
  }
});

router.use(authenticate);
router.post('/', authorize('admin'), userServiceProxy);
router.get('/:id', userServiceProxy);
router.put('/:id', authorize('admin'), userServiceProxy);
router.delete('/:id', authorize('admin'), userServiceProxy);

export default router;