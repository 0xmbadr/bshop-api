import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import { JWT_EXPIRE_TIME, JWT_SECRET } from '../config';

export const generateToken = (payload: Types.ObjectId) =>
  jwt.sign({ user_id: payload }, JWT_SECRET as string, {
    expiresIn: JWT_EXPIRE_TIME,
  });
