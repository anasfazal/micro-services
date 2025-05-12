import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { userModel } from '../models/userModel.js';
import { HTTP_STATUS_CODES } from '../utils/statusCodes.js';

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(HTTP_STATUS_CODES.BadRequest).json({
      status: HTTP_STATUS_CODES.BadRequest,
      message: 'Email and password are required'
    });
  }

  const user = await userModel.getUserByEmail(email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(HTTP_STATUS_CODES.Unauthorized).json({
      status: HTTP_STATUS_CODES.Unauthorized,
      message: 'Invalid credentials'
    });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.status(HTTP_STATUS_CODES.OK).json({
    status: HTTP_STATUS_CODES.OK,
    data: {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    }
  });
});