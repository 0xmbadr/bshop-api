import { check } from 'express-validator';
import slugify from 'slugify';
import UserModel from '../../database/models/User';
import validatorMiddleware from '../../middlewares/ValidatorMiddleware';

// export const getBrandValidator = [
//   check('id').isMongoId().withMessage('Invalid category id format'),
//   validatorMiddleware,
// ];

export const createUserValidator = [
  check('name')
    .notEmpty()
    .withMessage('User name required')
    .isLength({ min: 3 })
    .withMessage('Too short User name')
    .isLength({ max: 32 })
    .withMessage('Too long User name')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom((val) =>
      UserModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error('E-mail already in use'));
        }
      }),
    ),
  check('password')
    .notEmpty()
    .withMessage('Password required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  check('phone')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage(
      'Invalid phone number, We only accept EG and SA Phone numbers',
    ),

  check('profileImg').optional(),
  check('role').optional(),
  validatorMiddleware,
];

// export const updateBrandValidator = [
//   check('id').isMongoId().withMessage('Invalid Brand id format'),
//   check('name').custom((val, { req }) => {
//     req.body.slug = slugify(val);
//     return true;
//   }),
//   validatorMiddleware,
// ];

// export const deleteBrandValidator = [
//   check('id').isMongoId().withMessage('Invalid Brand id format'),
//   validatorMiddleware,
// ];
