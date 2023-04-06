import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import slugify from 'slugify';
import ApiError from '../utils/ApiError';
import ApiFeatures from '../utils/ApiFeatures';
import CategoryModel, { ICategory } from '../database/models/Category';

export const getCategories = asyncHandler(
  async (
    req: Request<unknown, unknown, ICategory, { page: number; limit: number }>,
    res: Response,
  ) => {
    const documentCounts = await CategoryModel.countDocuments();
    const apiFeatures = new ApiFeatures(CategoryModel.find(), req.query)
      .paginate(documentCounts)
      .filter()
      .search('Category')
      .limitFields()
      .sort();

    const { mongooseQuery, paginationResult } = apiFeatures;
    const categories = await mongooseQuery;

    res
      .status(201)
      .json({ result: categories.length, paginationResult, data: categories });
  },
);

export const getSingleCategory = asyncHandler(
  async (
    req: Request<{ id: string }, unknown, unknown, unknown>,
    res: Response,
    next: NextFunction,
  ) => {
    const { id } = req.params;
    const category: ICategory | null = await CategoryModel.findById(id);
    if (!category)
      return next(new ApiError(`No Category associated with this id`, 404));
    res.status(201).json({ data: category });
  },
);

// @desc    Create Category
// @route   POST  /api/v1/categories
// @access  Private
export const createCategory = asyncHandler(
  async (req: Request<unknown, unknown, ICategory, unknown>, res: Response) => {
    const { name } = req.body;
    const category: ICategory = await CategoryModel.create({
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
    const category: ICategory | null = await CategoryModel.findByIdAndUpdate(
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
  async (
    req: Request<{ id: string }, {}, {}, {}>,
    res: Response,
    next: NextFunction,
  ) => {
    const { id } = req.params;
    const category: ICategory | null = await CategoryModel.findByIdAndDelete(
      id,
    );
    if (!category)
      return next(new ApiError(`No Category associated with this id`, 404));
    res.status(201).send();
  },
);
