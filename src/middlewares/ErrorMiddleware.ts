import { Request, Response, NextFunction } from 'express';
import ApiError from './../utils/ApiError';

const globalError = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'dev') {
    sendErrorForDev(err, res);
  } else {
    sendErrorForProd(err, res);
  }
};

const sendErrorForDev = (err: ApiError, res: Response) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorForProd = (err: ApiError, res: Response) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

export default globalError;
