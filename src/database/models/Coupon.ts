import { Schema, model } from 'mongoose';

interface ICoupon {
  name: string;
  type: Date;
  discount: number;
}

const couponSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Coupon name required'],
      unique: true,
    },
    expire: {
      type: Date,
      required: [true, 'Coupon expire time required'],
    },
    discount: {
      type: Number,
      required: [true, 'Coupon discount value required'],
    },
  },
  { timestamps: true },
);

const Coupon = model<ICoupon>('Coupon', couponSchema);

export default Coupon;
