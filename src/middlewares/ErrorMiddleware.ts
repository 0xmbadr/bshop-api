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
    if (err.name === 'JsonWebTokenError') {
      // chnage err obj to a meaningful version
      err = handleJWTInvalidSignature();
    }
    if (err.name === 'TokenExpiredError') {
      // chnage err obj to a meaningful version
      err = handleJWTExpired();
    }
    sendErrorForProd(err, res);
  }
};

const handleJWTInvalidSignature = () =>
  new ApiError('Invalid token, please sign in again', 401);

const handleJWTExpired = () =>
  new ApiError('Expired token, please sign in again', 401);

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
