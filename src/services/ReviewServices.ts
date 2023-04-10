import factory from './ModelServices';
import Review from '../database/models/Review';
import { NextFunction, Request } from 'express';

// Nested route
// GET /api/v1/products/:productId/reviews
export const createFilterObj = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObj = filterObject;
  next();
};

// @desc    Get list of reviews
// @route   GET /api/v1/reviews
// @access  Public
export const getReviews = factory.getAll(Review, 'Review');

// @desc    Get specific review by id
// @route   GET /api/v1/reviews/:id
// @access  Public
export const getReview = factory.getOne(Review);

export const setProductIdAndUserIdToBody = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

// @desc    Create review
// @route   POST  /api/v1/reviews
// @access  Private/Protect/User
export const createReview = factory.createOne(Review);

// @desc    Update specific review
// @route   PUT /api/v1/reviews/:id
// @access  Private/Protect/User
export const updateReview = factory.updateOne(Review);

// @desc    Delete specific review
// @route   DELETE /api/v1/reviews/:id
// @access  Private/Protect/User-Admin-Manager
export const deleteReview = factory.deleteOne(Review);
