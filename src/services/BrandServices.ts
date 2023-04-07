import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import BrandModel from '../database/models/Brand';
import Factory from './ModelServices';
import { uploadSingleImage } from '../middlewares/UploadImagesMiddleware';
import asyncHandler from 'express-async-handler';
import sharp from 'sharp';

export const uploadBrandImage = uploadSingleImage('image');

export const resizeImage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file?.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`./uploads/brands/${filename}`);

    // save image name to DB
    req.body.image = filename;

    next();
  },
);

export const getBrands = Factory.getAll(BrandModel, 'Brand');

export const getSingleBrand = Factory.getOne(BrandModel);

export const createBrand = Factory.createOne(BrandModel);

export const updateBrand = Factory.updateOne(BrandModel);

export const deleteBrand = Factory.deleteOne(BrandModel);
