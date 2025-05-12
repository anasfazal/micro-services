import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { 
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { cacheMiddleware } from '../middleware/cache.js';

const router = express.Router();

router.get('/', 
  cacheMiddleware('products'),
  asyncHandler(getProducts)
);

router.get('/:id',
  cacheMiddleware('product'),
  asyncHandler(getProduct)
);

router.post('/',
  asyncHandler(authenticate),
  asyncHandler(authorize('seller')),
  asyncHandler(createProduct)
);

router.put('/:id',
  asyncHandler(authenticate),
  asyncHandler(authorize('seller')),
  asyncHandler(updateProduct)
);

router.delete('/:id',
  asyncHandler(authenticate),
  asyncHandler(authorize('seller')),
  asyncHandler(deleteProduct)
);

export default router;