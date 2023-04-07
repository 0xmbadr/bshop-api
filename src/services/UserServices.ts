import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import UserModel from '../database/models/User';
import Factory from './ModelServices';
import { uploadSingleImage } from '../middlewares/UploadImagesMiddleware';
import asyncHandler from 'express-async-handler';
import sharp from 'sharp';

export const uploadUserImage = uploadSingleImage('profileImg');

export const resizeImage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

    if (req.file) {
      await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`./uploads/users/${filename}`);

      // save image name to DB
      req.body.profileImg = filename;
    }

    next();
  },
);

export const getUsers = Factory.getAll(UserModel, 'User');

export const getSingleUser = Factory.getOne(UserModel);

export const createUser = Factory.createOne(UserModel);

export const updateUser = Factory.updateOne(UserModel);

export const deleteUser = Factory.deleteOne(UserModel);
