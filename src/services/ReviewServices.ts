import factory from './ModelServices';
import Review from '../database/models/Review';

// @desc    Get list of reviews
// @route   GET /api/v1/reviews
// @access  Public
export const getReviews = factory.getAll(Review, 'Review');

// @desc    Get specific review by id
// @route   GET /api/v1/reviews/:id
// @access  Public
export const getReview = factory.getOne(Review);

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
