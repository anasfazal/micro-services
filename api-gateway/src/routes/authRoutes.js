import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { authRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

const authServiceProxy = createProxyMiddleware({
  target: 'http://localhost:5001',
  changeOrigin: true,
  pathRewrite: { '^/api/auth': '/' },
  onProxyReq: (proxyReq, req) => {
    
    if (req.body && req.method === 'POST') {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  }
});

router.post('/login', authRateLimiter, authServiceProxy);
router.post('/register', authRateLimiter, authServiceProxy);
router.use(authServiceProxy);

export default router;