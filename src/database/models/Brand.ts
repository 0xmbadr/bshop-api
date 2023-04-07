import { Schema, model } from 'mongoose';
import { BASE_URL } from '../../config';

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

const setImageUrl = (doc: any) => {
  if (doc.image) {
    const imageUrl = `${BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};

// works in findOne, findAll, update
BrandSchema.post('init', (doc) => {
  setImageUrl(doc);
});
// works in create
BrandSchema.post('save', (doc) => {
  setImageUrl(doc);
});
const BrandModel = model<IBrand>('Brand', BrandSchema, 'brands');

export default BrandModel;
