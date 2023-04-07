import CategoryModel from '../database/models/Category';
import Factory from './ModelServices';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import asyncHandler from 'express-async-handler';
import { NextFunction, Request, Response } from 'express';
import { uploadSingleImage } from '../middlewares/UploadImagesMiddleware';

export const uploadCategoryImage = uploadSingleImage('image');

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
