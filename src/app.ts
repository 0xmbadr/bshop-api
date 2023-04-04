import express, { Request, Response } from 'express';
import morgan from 'morgan';
import './database'; // ! DB initalization
import { env } from './config';

import CategoryRoutes from './routes/CategoryRoutes';
import ApiError from './utils/ApiError';
const app = express();

// MIDDLEWARES
if (env === 'dev') {
  app.use(morgan('dev'));
}
app.use(express.json({ limit: '10mb' }));
app.use(
  express.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }),
);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello world');
});

app.use('/api/v1/categories', CategoryRoutes);

app.all('*', (req, res, next) => {
  next(new ApiError(`This Route doesn't exist`, 400));
});

export default app;
