import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import SubCategoryModel, {
  ISubCategory,
} from './../database/models/SubCategory';
import { ICategory } from './../database/models/Category';
import slugify from 'slugify';
import ApiError from './../utils/ApiError';
import ApiFeatures from './../utils/ApiFeatures';

// ! Nest Route
// GET /api/v1/categories/:categoryId/subcategories

export const createFilterObj = (
  req: Request<{ categoryId?: string }, {}, {}, {}>,
  res: Response,
  next: NextFunction,
) => {
  let filterObject: { category?: string } = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  // @ts-ignore
  req.filterObj = filterObject;
  next();
};
export const getSubCategories = asyncHandler(
  async (
    req: Request<{}, unknown, {}, { page: number; limit: number }>,
    res: Response,
  ) => {
    const documentCounts = await SubCategoryModel.countDocuments();
    const apiFeatures = new ApiFeatures(SubCategoryModel.find(), req.query)
      .paginate(documentCounts)
      .filter()
      .search('SubCategory')
      .limitFields()
      .sort();

    const { mongooseQuery, paginationResult } = apiFeatures;
    const subcategories = await mongooseQuery;

    res
      .status(201)
      .json({
        result: subcategories.length,
        paginationResult,
        data: subcategories,
      });
  },
  // const page: number = req.query.page || 1;
  // const limit: number = req.query.limit || 5;
  // const skip = (page - 1) * limit;
  // const subcategories = await SubCategoryModel.find(req.filterObj)
  //   .skip(skip)
  //   .limit(limit);
  // res.status(201).json({ result: subcategories.length, data: subcategories });
  // }
);

export const getSingleSubCategory = asyncHandler(
  async (
    req: Request<{ id: number }, unknown, unknown, unknown>,
    res: Response,
    next: NextFunction,
  ) => {
    const { id } = req.params;
    const subcategory: ISubCategory | null = await SubCategoryModel.findById(
      id,
    );
    if (!subcategory)
      return next(new ApiError(`No Category associated with this id`, 404));
    res.status(201).json({ data: subcategory });
  },
);

export const setCategoryIdToBody = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.body.category!) req.body.category = req.params.categoryId;
  next();
};

export const createSubCategory = asyncHandler(
  async (
    req: Request<{}, {}, { name: string; category: ICategory }, {}>,
    res: Response,
  ) => {
    const { name, category } = req.body;
    const subCategory: ISubCategory = await SubCategoryModel.create({
      name,
      slug: slugify(name),
      category,
    });
    res.status(201).json({ data: subCategory });
  },
);

export const updateSubCategory = asyncHandler(
  async (
    req: Request<{ id: string }, {}, { name: string; category: ICategory }, {}>,
    res: Response,
    next: NextFunction,
  ) => {
    const { id } = req.params;
    const { name, category } = req.body;
    const subcategory: ISubCategory | null =
      await SubCategoryModel.findByIdAndUpdate(
        { _id: id },
        { name, slug: slugify(name), category },
        { new: true },
      );
    if (!subcategory)
      return next(new ApiError(`No Category associated with this id`, 404));
    res.status(201).json({ data: subcategory });
  },
);

export const deleteSubCategory = asyncHandler(
  async (
    req: Request<{ id: string }, {}, {}, {}>,
    res: Response,
    next: NextFunction,
  ) => {
    const { id } = req.params;
    const subcategory: ISubCategory | null =
      await SubCategoryModel.findByIdAndDelete(id);
    if (!subcategory)
      return next(new ApiError(`No Category associated with this id`, 404));
    res.status(201).send();
  },
);
