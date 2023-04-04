// @ts-nocheck
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import slugify from 'slugify';
import Category, { CategoryModel } from './../database/models/Category';

// @desc    get all categories
// @route   GET  /api/v1/categories
// @access  Private
export const getCategories = asyncHandler(
  async (req: Request, res: Response) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (page - 1) * limit;
    const categories = await CategoryModel.find({}).skip(skip).limit(limit);
    res.status(201).json({ result: categories.length, data: categories });
  },
);

// @desc    get single categories
// @route   GET  /api/v1/categories/:id
// @access  Private
export const getSingleCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const category = await CategoryModel.findById(id);
    if (!category)
      res.status(404).json({ message: `No Category associated with this id` });
    res.status(201).json({ data: category });
  },
);

// @desc    Create Category
// @route   POST  /api/v1/categories
// @access  Private
export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { name } = req.body;
    const category = await CategoryModel.create({
      name,
      slug: slugify(name),
    } as Category);
    res.status(201).json({ data: category });
  },
);

export const updateCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;
    const category = await CategoryModel.findByIdAndUpdate(
      { _id: id },
      { name, slug: slugify(name) },
      { new: true },
    );
    if (!category)
      res.status(404).json({ message: `No Category associated with this id` });
    res.status(201).json({ data: category });
  },
);

export const deleteCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const category = await CategoryModel.findByIdAndDelete(id);
    if (!category)
      res.status(404).json({ message: `No Category associated with this id` });
    res.status(201).send();
  },
);
