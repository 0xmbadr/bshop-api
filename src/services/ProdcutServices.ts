// @ts-nocheck
import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import slugify from 'slugify';
import ApiError from '../utils/ApiError';
import ProductModel, { IProduct } from './../database/models/Product';

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  // Filteration
  const queryStringObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields', 'keyword'];
  excludedFields.forEach((field) => delete queryStringObj[field]);
  let queryStr = JSON.stringify(queryStringObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  // Pagination
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;
  const skip = (page - 1) * limit;

  // Build Query

  let mongooseQuery = ProductModel.find(JSON.parse(queryStr))
    .skip(skip)
    .limit(limit)
    .populate({ path: 'category', select: 'name -_id' });

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');

    mongooseQuery = mongooseQuery.sort(sortBy);
  } else {
    mongooseQuery = mongooseQuery.sort('-createdAt');
  }

  // Limiting Fields
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    mongooseQuery = mongooseQuery.select(fields);
  } else {
    mongooseQuery = mongooseQuery.select('-__v');
  }

  // search
  if (req.query.keyword) {
    const query = [
      { title: { $regex: req.query.keyword, $options: 'i' } },
      { description: { $regex: req.q, $options: 'i' } },
    ];
    mongooseQuery = mongooseQuery.or(query);
  }

  // Execute query
  const products = await mongooseQuery;

  res.status(201).json({ result: products.length, data: products });
});

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
    // Valdiate if category exists in DB
    // const category = await CategoryModel.find(req.body.category)
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
