import { NextFunction, Request, Response } from 'express';
import SubCategoryModel from './../database/models/SubCategory';
import Factory from './ModelServices';

export const setCategoryIdToBody = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

export const createFilterObj = (
  // ! Nest Route
  // GET /api/v1/categories/:categoryId/subcategories
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
export const getSubCategories = Factory.getAll(SubCategoryModel, 'SubCategory');

export const getSingleSubCategory = Factory.getOne(SubCategoryModel);

export const createSubCategory = Factory.createOne(SubCategoryModel);

export const updateSubCategory = Factory.updateOne(SubCategoryModel);

export const deleteSubCategory = Factory.deleteOne(SubCategoryModel);
