// @ts-nocheck
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

export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // * check if token exist
    let token: string = '';
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return next(
        new ApiError(
          `You're not logged in, please login to access this route!`,
          401,
        ),
      );
    }

    // * Verify Token
    const decoded = jwt.verify(token, JWT_SECRET as string);

    // * check if user exists
    const currentUser = await UserModel.findById(decoded.user_id);

    if (!currentUser)
      next(
        new ApiError(
          'The User who belongs to this token is no longer exits',
          401,
        ),
      );

    // * check if user change his password after token created
    if (currentUser?.passwordChangedAt) {
      const passwordChangedAtTimestamp = parseInt(
        currentUser.passwordChangedAt.getTime() / 1000,
        10,
      );
      // password changed after token created
      if (passwordChangedAtTimestamp > decoded.iat) {
        return next(
          new ApiError(
            'User has recently changed his password, please log in again',
            401,
          ),
        );
      }
    }
    req.user = currentUser;

    next();
  },
);
export const allowedTo = (...roles) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError('You are not autherized to do this action', 403),
      );
    }

    next();
  });
