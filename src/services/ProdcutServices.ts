import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import slugify from 'slugify';
import ApiError from '../utils/ApiError';
import ProductModel, { IProduct } from './../database/models/Product';

export const getProducts = asyncHandler(
  async (
    req: Request<unknown, unknown, IProduct, { page: number; limit: number }>,
    res: Response,
  ) => {
    const page: number = req.query.page || 1;
    const limit: number = req.query.limit || 5;
    const skip = (page - 1) * limit;
    const products = await ProductModel.find({})
      .skip(skip)
      .limit(limit)
      .populate({ path: 'category', select: 'name -_id' });
    res.status(201).json({ result: products.length, data: products });
  },
);

export const getSingleProdcut = asyncHandler(
  async (
    req: Request<{ id: string }, unknown, unknown, unknown>,
    res: Response,
    next: NextFunction,
  ) => {
    const { id } = req.params;
    const product: IProduct | null = await ProductModel.findById(id);
    if (!product)
      return next(new ApiError(`No Product associated with this id`, 404));
    res.status(201).json({ data: product });
  },
);

export const createProduct = asyncHandler(
  async (req: Request<unknown, unknown, IProduct, unknown>, res: Response) => {
    req.body.slug = slugify(req.body.title);
    const product: IProduct = await ProductModel.create(req.body);
    res.status(201).json({ data: product });
  },
);

export const updateProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const product: IProduct | null = await ProductModel.findByIdAndUpdate(
      { _id: id },
      req.body,
      { new: true },
    );
    if (!product)
      return next(new ApiError(`No Product associated with this id`, 404));
    res.status(201).json({ data: product });
  },
);

export const deleteProduct = asyncHandler(
  async (
    req: Request<{ id: string }, {}, {}, {}>,
    res: Response,
    next: NextFunction,
  ) => {
    const { id } = req.params;
    const product: IProduct | null = await ProductModel.findByIdAndDelete(id);
    if (!product)
      return next(new ApiError(`No Product associated with this id`, 404));
    res.status(201).send();
  },
);
