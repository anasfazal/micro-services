import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { login } from '../controllers/authController.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/login', 
  asyncHandler(authRateLimiter),
  asyncHandler(login)
);

export default router;