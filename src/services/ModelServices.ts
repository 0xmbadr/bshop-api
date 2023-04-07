// @ts-nocheck
import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import ApiFeatures from './../utils/ApiFeatures';
import ApiError from './../utils/ApiError';
// @ts-ignore
const deleteOne = (Model) =>
  asyncHandler(
    async (
      req: Request<{ id: string }, {}, {}, {}>,
      res: Response,
      next: NextFunction,
    ) => {
      const { id } = req.params;
      const doc = await Model.findByIdAndDelete(id);

      if (!doc)
        return next(new ApiError(`No document associated with this id`, 404));
      res.status(201).send();
    },
  );
// @ts-ignore
const updateOne = (Model) =>
  asyncHandler(
    async (
      req: Request<{ id: string }, {}, {}, {}>,
      res: Response,
      next: NextFunction,
    ) => {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!doc)
        return next(new ApiError(`No doc associated with this id`, 404));
      res.status(201).json({ data: doc });
    },
  );

// @ts-ignore
const createOne = (Model) =>
  asyncHandler(async (req: Request, res: Response) => {
    // create method ignores any field that doesn't exist in the schema
    const doc = await Model.create(req.body);
    res.status(201).json({ data: doc });
  });

// @ts-ignore
const getOne = (Model) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) return next(new ApiError(`No Doc associated with this id`, 404));
    res.status(201).json({ data: doc });
  });

// @ts-ignore
const getAll = (Model, ModelName) =>
  asyncHandler(async (req: Request, res: Response) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    const documentCounts = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(documentCounts)
      .filter()
      .search(ModelName)
      .limitFields()
      .sort();

    const { mongooseQuery, paginationResult } = apiFeatures;
    const brands = await mongooseQuery;

    res
      .status(201)
      .json({ result: brands.length, paginationResult, data: brands });
  });
export default { deleteOne, updateOne, createOne, getOne, getAll };
