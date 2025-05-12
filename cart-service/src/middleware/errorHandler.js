import { HTTP_STATUS_CODES } from '../utils/statusCodes.js';

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || HTTP_STATUS_CODES.InternalServerError;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    status: statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};