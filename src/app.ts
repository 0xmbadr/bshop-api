import path from 'path';

import express from 'express';
import morgan from 'morgan';

import mountRoutes from './routes';

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
mountRoutes(app);

app.all('*', (req, res, next) => {
  next(new ApiError(`This Route doesn't exist`, 400));
});

export default app;
