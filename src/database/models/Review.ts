import mongoose, { model, Types } from 'mongoose';

export interface IReview {
  title: string;
  ratings: string;
  user: Types.ObjectId;
  product: Types.ObjectId;
}

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    ratings: {
      type: Number,
      min: [1, 'Min ratings value is 1.0'],
      max: [5, 'Max ratings value is 5.0'],
      required: [true, 'review ratings required'],
    },
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to user'],
    },
    product: {
      type: Types.ObjectId,
      ref: 'Product',
      required: [true, 'Review must belong to product'],
    },
  },
  {
    timestamps: true,
  },
);

const Review = model<IReview>('Review', reviewSchema, 'reviews');

export default Review;
