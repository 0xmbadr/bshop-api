import express from 'express';
import {
  deleteReviewValidator,
  createReviewValidator,
  updateReviewValidator,
} from '../utils/validators/ReviewValidators';
import { allowedTo, protect } from '../services/AuthServices';
import {
  createReview,
  deleteReview,
  getReview,
  getReviews,
  setProductIdAndUserIdToBody,
  updateReview,
} from '../services/ReviewServices';
import { createFilterObj } from '../services/ReviewServices';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(createFilterObj, getReviews)
  .post(
    protect,
    allowedTo('user'),
    setProductIdAndUserIdToBody,
    createReviewValidator,
    createReview,
  );
router
  .route('/:id')
  .get(getReview)
  .put(protect, allowedTo('user'), updateReviewValidator, updateReview)
  .delete(
    protect,
    allowedTo('user', 'manager', 'admin'),
    deleteReviewValidator,
    deleteReview,
  );

export default router;
