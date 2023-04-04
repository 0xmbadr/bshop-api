import { Document, model, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  image?: string;
}

export const DOCUMENT_NAME = 'Category';
export const COLLECTION_NAME = 'categories';

const CategorySchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: [true, 'Category name is required!!!'],
      unique: [true, 'Cateogry name must be unique!'],
      minlength: [3, 'Too short Category name'],
      maxlength: [32, 'Too long Category name'],
    },
    slug: {
      type: Schema.Types.String,
      lowercase: true,
    },
    image: {
      type: Schema.Types.String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const CategoryModel = model<ICategory>(
  DOCUMENT_NAME,
  CategorySchema,
  COLLECTION_NAME,
);

export default CategoryModel;
