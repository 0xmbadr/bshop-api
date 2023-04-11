import { model, Schema, Types } from 'mongoose';
import bcrypt from 'bcryptjs';
export interface IUser {
  name: string;
  slug: string;
  email: string;
  phone: string;
  profileImg: string;
  password: string;
  role: string;
  active: Boolean;
}

const UserSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'name required'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, 'email required'],
      unique: true,
      lowercase: true,
    },
    phone: String,
    profileImg: String,

    password: {
      type: String,
      required: [true, 'password required'],
      minlength: [6, 'Too short password'],
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    role: {
      type: String,
      enum: ['user', 'manager', 'admin'],
      default: 'user',
    },
    active: {
      type: Boolean,
      default: true,
    },
    // Child ref => when small num expected
    wishlist: [
      {
        type: Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  { timestamps: true },
);

// Hashing user password
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const UserModel = model<IUser>('User', UserSchema, 'users');

export default UserModel;
