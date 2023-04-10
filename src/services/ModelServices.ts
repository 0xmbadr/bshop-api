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

      // Trigger "remove" event when update document
      document.remove();
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

      // Trigger "save" event when update document
      document.save();
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

export const getOne = (Model, populationOpt?) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // 1) Build query
    let query = Model.findById(id);
    if (populationOpt) {
      query = query.populate(populationOpt);
    }

    // 2) Execute query
    const document = await query;

    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }
    res.status(200).json({ data: document });
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
    const docs = await mongooseQuery;

    res.status(201).json({ result: docs.length, paginationResult, data: docs });
  });
export default { deleteOne, updateOne, createOne, getOne, getAll };
