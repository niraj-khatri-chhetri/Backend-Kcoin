import catchAsyncErrors from './catchAsyncErrors.js';
import ErrorHandler from '../utils/errorhandler.js';
import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';

export const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler('Unauthorized to access this resource', 401));
  }

  console.log('VERIFY SECRET:', process.env.JWT_SECRET);
  console.log('TOKEN:', token);

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decodedData.id);

  next();
});
