import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HTTP_STATUS_CODES } from '../utils/statusCodes.js';

export const authenticate = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(HTTP_STATUS_CODES.Unauthorized).json({
      status: HTTP_STATUS_CODES.Unauthorized,
      message: 'Authentication required'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(HTTP_STATUS_CODES.Unauthorized).json({
      status: HTTP_STATUS_CODES.Unauthorized,
      message: 'Invalid token'
    });
  }
});