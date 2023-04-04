import mongoose, { model, Schema, Types } from 'mongoose';

export interface ISubCategory extends Document {
  name: string;
  slug: string;
  category: Types.ObjectId;
}

const SubCategorySchma = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: [true, 'SubCategory name is required!!!'],
      unique: [true, 'SubCategory name must be unique!'],
      minlength: [3, 'Too short SubCategory name'],
      maxlength: [32, 'Too long SubCategory name'],
    },
    slug: {
      type: Schema.Types.String,
      lowercase: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: 'Category',
      required: [true, 'SubCategory must belong to a parent Category!'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const SubCategoryModel = model<ISubCategory>(
  'SubCategory',
  SubCategorySchma,
  'subcategories',
);

export default SubCategoryModel;
