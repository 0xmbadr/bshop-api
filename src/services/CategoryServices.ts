import CategoryModel from '../database/models/Category';
import Factory from './ModelServices';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import ApiError from '../utils/ApiError';
import sharp from 'sharp';
import asyncHandler from 'express-async-handler';
import { NextFunction, Request, Response } from 'express';

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, './uploads/categories'), // cb -> callback
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
//     cb(null, filename);
//   },
// });

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: any, cb: Function) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new ApiError('Only Images allowed', 400), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 1000000 * 5 },
  fileFilter,
});
export const uploadCategoryImage = upload.single('image');

export const resizeImage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file?.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`./uploads/categories/${filename}`);

    // save image name to DB
    req.body.image = filename;

    next();
  },
);

export const getCategories = Factory.getAll(CategoryModel, 'Category');

export const getSingleCategory = Factory.getOne(CategoryModel);

export const createCategory = Factory.createOne(CategoryModel);

export const updateCategory = Factory.updateOne(CategoryModel);

export const deleteCategory = Factory.deleteOne(CategoryModel);
