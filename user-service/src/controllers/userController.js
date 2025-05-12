import { asyncHandler } from '../utils/asyncHandler.js';
import { HTTP_STATUS_CODES } from '../utils/statusCodes.js';
import { userModel } from '../models/userModel.js';

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existingUser = await userModel.getUserByEmail(email);
  if (existingUser) {
    return res.status(HTTP_STATUS_CODES.Conflict).json({
      status: HTTP_STATUS_CODES.Conflict,
      message: 'User already exists'
    });
  }

  const userId = await userModel.createUser(name, email, password, role);
  
  res.status(HTTP_STATUS_CODES.Created).json({
    status: HTTP_STATUS_CODES.Created,
    data: { userId }
  });
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await userModel.getUserById(req.params.id);
  
  if (!user) {
    return res.status(HTTP_STATUS_CODES.NotFound).json({
      status: HTTP_STATUS_CODES.NotFound,
      message: 'User not found'
    });
  }

  res.status(HTTP_STATUS_CODES.OK).json({
    status: HTTP_STATUS_CODES.OK,
    data: user
  });
});

export const updateUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const updates = req.body;

  const success = await userModel.updateUser(userId, updates);
  
  if (!success) {
    return res.status(HTTP_STATUS_CODES.NotFound).json({
      status: HTTP_STATUS_CODES.NotFound,
      message: 'User not found'
    });
  }

  res.status(HTTP_STATUS_CODES.OK).json({
    status: HTTP_STATUS_CODES.OK,
    message: 'User updated successfully'
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const success = await userModel.deleteUser(userId);
  
  if (!success) {
    return res.status(HTTP_STATUS_CODES.NotFound).json({
      status: HTTP_STATUS_CODES.NotFound,
      message: 'User not found'
    });
  }

  res.status(HTTP_STATUS_CODES.OK).json({
    status: HTTP_STATUS_CODES.OK,
    message: 'User deleted successfully'
  });
});