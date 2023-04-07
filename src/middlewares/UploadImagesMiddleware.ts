import { Request } from 'express';
import multer from 'multer';
import ApiError from '../utils/ApiError';

const multerOptions = () => {
  const multerStorage = multer.memoryStorage();

  const multerFilter = function (req: Request, file: any, cb: Function) {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new ApiError('Only Images allowed', 400), false);
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

  return upload;
};

export const uploadSingleImage = (fieldName: string) =>
  multerOptions().single(fieldName);

export const uploadMixOfImages = (arrayOfFields: any) =>
  multerOptions().fields(arrayOfFields);
