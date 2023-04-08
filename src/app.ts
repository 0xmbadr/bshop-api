import path from 'path';

import express from 'express';
import morgan from 'morgan';

import CategoryRoutes from './routes/CategoryRoutes';
import SubCategoryRoutes from './routes/SubCategoryRoutes';
import BrandsRoutes from './routes/BrandRoutes';
import ProductRoutes from './routes/ProductRoutes';
import UserRoutes from './routes/UserRoutes';
import AuthRoutes from './routes/AuthRoutes';
import ApiError from './utils/ApiError';

import './database'; // ! DB initalization
import { env } from './config';
const app = express();

// MIDDLEWARES
if (env === 'dev') {
  app.use(morgan('dev'));
}
app.use(express.json({ limit: '10mb' }));
app.use(
  express.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }),
);
app.use(express.static(path.join(__dirname, 'uploads/')));

// ROUTES
app.use('/api/v1/categories', CategoryRoutes);
app.use('/api/v1/subcategories', SubCategoryRoutes);
app.use('/api/v1/brands', BrandsRoutes);
app.use('/api/v1/products', ProductRoutes);
app.use('/api/v1/users', UserRoutes);
app.use('/api/v1/auth', AuthRoutes);

app.all('*', (req, res, next) => {
  next(new ApiError(`This Route doesn't exist`, 400));
});

export default app;
