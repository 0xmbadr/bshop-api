import { Application } from 'express';

import CategoryRoutes from './CategoryRoutes';
import SubCategoryRoutes from './SubCategoryRoutes';
import BrandsRoutes from './BrandRoutes';
import ProductRoutes from './ProductRoutes';
import UserRoutes from './UserRoutes';
import AuthRoutes from './AuthRoutes';
import ReviewRoutes from './ReviewRoutes';
import wishlistRoutes from './wishlistRoutes';
import AddressRoutes from './AddressRoutes';
import CouponRoutes from './CategoryRoutes';

const mountRoutes = (app: Application) => {
  app.use('/api/v1/categories', CategoryRoutes);
  app.use('/api/v1/subcategories', SubCategoryRoutes);
  app.use('/api/v1/brands', BrandsRoutes);
  app.use('/api/v1/products', ProductRoutes);
  app.use('/api/v1/users', UserRoutes);
  app.use('/api/v1/auth', AuthRoutes);
  app.use('/api/v1/reviews', ReviewRoutes);
  app.use('/api/v1/wishlists', wishlistRoutes);
  app.use('/api/v1/addresses', AddressRoutes);
  app.use('/api/v1/coupons', CouponRoutes);
};

export default mountRoutes;
