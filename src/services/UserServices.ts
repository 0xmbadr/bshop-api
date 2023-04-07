import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import UserModel from '../database/models/User';
import Factory from './ModelServices';
import { uploadSingleImage } from '../middlewares/UploadImagesMiddleware';
import asyncHandler from 'express-async-handler';
import sharp from 'sharp';
import bcrypt from 'bcryptjs';
import ApiError from '../utils/ApiError';

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

export const updateUser = asyncHandler(async (req, res, next) => {
  const document = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    {
      new: true,
    },
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

export const changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    },
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

export const deleteUser = Factory.deleteOne(UserModel);
