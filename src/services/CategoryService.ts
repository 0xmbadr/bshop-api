import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import slugify from 'slugify';
import ApiError from './../utils/ApiError';
import Category, { CategoryModel } from './../database/models/Category';

// @desc    get all categories
// @route   GET  /api/v1/categories
// @access  Private
export const getCategories = asyncHandler(
  async (
    req: Request<unknown, unknown, Category, { page: number; limit: number }>,
    res: Response,
  ) => {
    const page: number = req.query.page || 1;
    const limit: number = req.query.limit || 5;
    const skip = (page - 1) * limit;
    const categories = await CategoryModel.find({}).skip(skip).limit(limit);
    res.status(201).json({ result: categories.length, data: categories });
  },
);

// @desc    get single categories
// @route   GET  /api/v1/categories/:id
// @access  Private
export const getSingleCategory = asyncHandler(
  async (
    req: Request<{ id: string }, unknown, unknown, unknown>,
    res: Response,
    next: NextFunction,
  ) => {
    const { id } = req.params;
    const category = await CategoryModel.findById(id);
    if (!category)
      return next(new ApiError(`No Category associated with this id`, 404));
    res.status(201).json({ data: category });
  },
);

// @desc    Create Category
// @route   POST  /api/v1/categories
// @access  Private
export const createCategory = asyncHandler(
  async (req: Request<unknown, unknown, Category, unknown>, res: Response) => {
    const { name } = req.body;
    const category = await CategoryModel.create({
      name,
      slug: slugify(name),
    });
    res.status(201).json({ data: category });
  },
);

// @desc    Update Category
// @route   PUT  /api/v1/categories/:id
// @access  Private
export const updateCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name } = req.body;
    const category = await CategoryModel.findByIdAndUpdate(
      { _id: id },
      { name, slug: slugify(name) },
      { new: true },
    );
    if (!category)
      return next(new ApiError(`No Category associated with this id`, 404));
    res.status(201).json({ data: category });
  },
);

// @desc    delete Category
// @route   DELETE  /api/v1/categories/:id
// @access  Private
export const deleteCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const category = await CategoryModel.findByIdAndDelete(id);
    if (!category)
      return next(new ApiError(`No Category associated with this id`, 404));
    res.status(201).send();
  },
);
