import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import UserModel from '../database/models/User';
import jwt from 'jsonwebtoken';
import { JWT_EXPIRE_TIME, JWT_SECRET } from '../config';

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
  const token = jwt.sign({ user_id: user._id }, JWT_SECRET as string, {
    expiresIn: JWT_EXPIRE_TIME,
  });

  // * Send Token to client
  res.status(201).json({ data: user, token });
});
