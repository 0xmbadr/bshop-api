import express from 'express';
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
  .post(protect, allowedTo('user'), createReview);
router
  .route('/:id')
  .get(getReview)
  .put(protect, allowedTo('user'), updateReview)
  .delete(protect, allowedTo('user', 'manager', 'admin'), deleteReview);

export default router;
