import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import slugify from 'slugify';
import ApiError from '../utils/ApiError';
import ApiFeatures from '../utils/ApiFeatures';
import BrandModel, { IBrand } from '../database/models/Brand';

export const getBrands = asyncHandler(
  async (
    req: Request<unknown, unknown, IBrand, { page: number; limit: number }>,
    res: Response,
  ) => {
    const documentCounts = await BrandModel.countDocuments();
    const apiFeatures = new ApiFeatures(BrandModel.find(), req.query)
      .paginate(documentCounts)
      .filter()
      .search('Brand')
      .limitFields()
      .sort();

    const { mongooseQuery, paginationResult } = apiFeatures;
    const brands = await mongooseQuery;

    res
      .status(201)
      .json({ result: brands.length, paginationResult, data: brands });
  },
);

export const getSingleBrand = asyncHandler(
  async (
    req: Request<{ id: string }, unknown, unknown, unknown>,
    res: Response,
    next: NextFunction,
  ) => {
    const { id } = req.params;
    const brand: IBrand | null = await BrandModel.findById(id);
    if (!brand)
      return next(new ApiError(`No Brand associated with this id`, 404));
    res.status(201).json({ data: brand });
  },
);

export const createBrand = asyncHandler(
  async (req: Request<unknown, unknown, IBrand, unknown>, res: Response) => {
    const { name } = req.body;
    const brand: IBrand = await BrandModel.create({
      name,
      slug: slugify(name),
    });
    res.status(201).json({ data: brand });
  },
);

export const updateBrand = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name } = req.body;
    const brand: IBrand | null = await BrandModel.findByIdAndUpdate(
      { _id: id },
      { name, slug: slugify(name) },
      { new: true },
    );
    if (!brand)
      return next(new ApiError(`No Brand associated with this id`, 404));
    res.status(201).json({ data: brand });
  },
);

export const deleteBrand = asyncHandler(
  async (
    req: Request<{ id: string }, {}, {}, {}>,
    res: Response,
    next: NextFunction,
  ) => {
    const { id } = req.params;
    const brand: IBrand | null = await BrandModel.findByIdAndDelete(id);
    if (!brand)
      return next(new ApiError(`No Brand associated with this id`, 404));
    res.status(201).send();
  },
);
