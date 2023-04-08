import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import UserModel from '../database/models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { JWT_EXPIRE_TIME, JWT_SECRET } from '../config';
import ApiError from '../utils/ApiError';
import { Types } from 'mongoose';

const generateToken = (payload: Types.ObjectId) =>
  jwt.sign({ user_id: payload }, JWT_SECRET as string, {
    expiresIn: JWT_EXPIRE_TIME,
  });

export const signup = asyncHandler(async (req: Request, res: Response) => {
  // * Create User
  const { name, email, password } = req.body;
  const user = await UserModel.create({
    // password will be hashed using mongoose middleware
    name,
    email,
    password,
  });
  // * Generate Toekn
  const token = generateToken(user._id);

  // * Send Token to client
  res.status(201).json({ data: user, token });
});

export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // * check if user exists with correct password
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new ApiError('Incorrect email or password', 400));
    }

    // * Generate Toekn
    const token = generateToken(user._id);

    // * Send Token to client
    res.status(201).json({ data: user, token });
  },
);
