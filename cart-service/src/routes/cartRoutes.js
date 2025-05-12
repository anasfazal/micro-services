import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { 
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart
} from '../controllers/cartController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(asyncHandler(authenticate));

router.post('/', asyncHandler(addToCart));


router.get('/', asyncHandler(getCart));


router.put('/:productId', asyncHandler(updateCartItem));


router.delete('/:productId', asyncHandler(removeFromCart));

export default router;