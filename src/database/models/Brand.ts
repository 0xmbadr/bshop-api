import { Schema, model } from 'mongoose';

export interface IBrand extends Document {
  name: string;
  slug: string;
  image?: string;
}

const BrandSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Brand required'],
      unique: [true, 'Brand must be unique'],
      minlength: [3, 'Too short Brand name'],
      maxlength: [32, 'Too long Brand name'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true },
);

const BrandModel = model<IBrand>('Brand', BrandSchema, 'brands');

export default BrandModel;
