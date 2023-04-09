// @ts-nocheck
import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import UserModel from '../database/models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import ApiError from '../utils/ApiError';
import sendEmail from '../utils/sendEmail';
import { generateToken } from '../utils/generateToken';
import { JWT_SECRET } from '../config';

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

export const forgetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // get user by email
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return next(
        new ApiError(
          `There is no user with this email: ${req.body.email}`,
          404,
        ),
      );
    }
    // if user exist? generate random 6 digits
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode = crypto
      .createHash('sha256')
      .update(resetCode)
      .digest('hex');

    // save hashed resetCode into DB
    user.passwordResetCode = hashedResetCode;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10m
    user.passwordResetVerified = false;

    await user.save();

    const message = `Hi ${user.name},\n We received a request to reset the password on your E-shop Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The B-shop Team`;
    // send reset code to email;

    try {
      const result = await sendEmail({
        email: user.email,
        subject: 'Pasword Reset!',
        message,
      });

      res.status(200).json({ status: 'Email sent', result });
    } catch (err) {
      console.log(err);
      res.send('Email not sent');
    }
  },
);

export const verifyResetCode = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const hashedResetCode = crypto
      .createHash('sha256')
      .update(req.body.resetCode)
      .digest('hex');

    const user = await UserModel.findOne({
      passwordResetCode: hashedResetCode,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ApiError('Reset Code invalid or expired', 401));
    }

    user.passwordResetVerified = true;
    await user.save();

    res.status(200).json({
      status: 'Success',
    });
  },
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return next(new ApiError('No user with this email', 401));
    }
    if (!user.passwordResetVerified) {
      return next(new ApiError('Reset Code not verified', 401));
    }

    user.password = req.body.newPassword;
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();

    // if everything is ok, generate token
    const token = generateToken(user._id);
    res.status(200).json({ token });
  },
);
