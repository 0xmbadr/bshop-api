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
  updateReview,
} from '../services/ReviewServices';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getReviews)
  .post(protect, allowedTo('user'), createReviewValidator, createReview);
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
