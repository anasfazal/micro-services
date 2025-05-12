import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { 
  registerUser,
  getUser,
  updateUser,
  deleteUser
} from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/',
  asyncHandler(authenticate),
  asyncHandler(authorize('admin')),
  asyncHandler(registerUser)
);

router.get('/:id',
  asyncHandler(authenticate),
  asyncHandler(getUser)
);

router.put('/:id',
  asyncHandler(authenticate),
  asyncHandler(authorize('admin')),
  asyncHandler(updateUser)
);

router.delete('/:id',
  asyncHandler(authenticate),
  asyncHandler(authorize('admin')),
  asyncHandler(deleteUser)
);

export default router;
