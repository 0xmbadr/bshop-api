import { check } from 'express-validator';
import slugify from 'slugify';
import validatorMiddleware from '../../middlewares/ValidatorMiddleware';

export const getBrandValidator = [
  check('id').isMongoId().withMessage('Invalid category id format'),
  validatorMiddleware,
];

export const createBrandValdiator = [
  check('name')
    .notEmpty()
    .withMessage('Brand name required')
    .isLength({ min: 3 })
    .withMessage('Too short Brand name')
    .isLength({ max: 32 })
    .withMessage('Too long Brand name')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

export const updateBrandValidator = [
  check('id').isMongoId().withMessage('Invalid Brand id format'),
  check('name').custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

export const deleteBrandValidator = [
  check('id').isMongoId().withMessage('Invalid Brand id format'),
  validatorMiddleware,
];
