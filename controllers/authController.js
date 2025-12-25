import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { User } from '../models/User.js';
import catchAsyncErrors from '../middleware/catchAsyncErrors.js';
import { sendToken } from '../utils/jwtToken.js';

export const register = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  console.log('🚀 ~ register ~ existingUser:', existingUser);
  if (existingUser)
    return res
      .status(400)
      .json({ success: false, message: 'User already exists' });

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashed,
    walletAddress: uuid(),
  });

  sendToken(user, 201, res);
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: 'Invalid credentials' });

  sendToken(user, 200, res);
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Logged Out',
  });
});

export const getMe = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id).select(
    '_id email walletAddress role'
  );

  return res
    .status(200)
    .json({ success: true, user, message: 'User fetched successfully' });
});
