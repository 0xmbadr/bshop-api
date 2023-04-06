import slugify from 'slugify';
import { check } from 'express-validator';
import validatorMiddleware from './../../middlewares/ValidatorMiddleware';
import CategoryModel from './../../database/models/Category';
import SubCategoryModel from './../../database/models/SubCategory';

export const createProductValidator = [
  check('title')
    .isLength({ min: 3 })
    .withMessage('must be at least 3 chars')
    .notEmpty()
    .withMessage('Product required')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check('description')
    .notEmpty()
    .withMessage('Product description is required')
    .isLength({ max: 2000 })
    .withMessage('Too long description'),

  check('quantity')
    .notEmpty()
    .withMessage('Product quantity is required')
    .isNumeric()
    .withMessage('Product quantity must be a number'),

  check('sold')
    .optional()
    .isNumeric()
    .withMessage('Product quantity must be a number'),

  check('price')
    .notEmpty()
    .withMessage('Product price is required')
    .isNumeric()
    .withMessage('Product price must be a number')
    .isLength({ max: 32 })
    .withMessage('To long price'),

  check('priceAfterDiscount')
    .optional()
    .isNumeric()
    .withMessage('Product priceAfterDiscount must be a number')
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error('priceAfterDiscount must be lower than price');
      }
      return true;
    }),

  check('colors')
    .optional()
    .isArray()
    .withMessage('availableColors should be array of string'),
  check('imageCover').notEmpty().withMessage('Product imageCover is required'),
  check('images')
    .optional()
    .isArray()
    .withMessage('images should be array of string'),

  check('category')
    .notEmpty()
    .withMessage('Product must belong to a category')
    .isMongoId()
    .withMessage('Invalid ID formate')
    .custom((categoryId: string) =>
      CategoryModel.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No Category for this id: ${categoryId}`),
          );
        }
      }),
    ),
  check('subcategories')
    .optional()
    .isArray()
    .withMessage('Subcategories must be inside an array!')
    .isMongoId()
    .withMessage('Invalid ID formate')
    .custom((value, { req }) =>
      SubCategoryModel.find({
        _id: { $in: value },
        category: req.body.category,
      }).then((subcategories) => {
        if (subcategories.length < 1 || subcategories.length !== value.length) {
          return Promise.reject(new Error('invalid subcategories'));
        }
      }),
    ),
  // .custom((subcategoriesIds) =>
  //   SubCategoryModel.find({
  //     _id: { $exists: true, $in: subcategoriesIds },
  //   }).then((result) => {
  //     if (result.length < 1 || result.length !== subcategoriesIds.length) {
  //       return Promise.reject(new Error('Invalid subcategories Ids'));
  //     }
  //   }),
  // )
  // .custom((val, { req }) =>
  //   SubCategoryModel.find({ category: req.body.category }).then(
  //     (subcategories) => {
  //       const subcategoriesIdsInDB = [] as unknown as [string];
  //       subcategories.forEach((subcategory) => {
  //         subcategoriesIdsInDB.push(subcategory._id.toString());
  //       });
  //       const checker = (target: [string], arr: [string]) =>
  //         target.every((v) => arr.includes(v));
  //       if (!checker(val, subcategoriesIdsInDB)) {
  //         return Promise.reject(
  //           new Error("subcategories don't belong to that category."),
  //         );
  //       }
  //     },
  //   ),
  // ),

  check('brand').optional().isMongoId().withMessage('Invalid ID formate'),
  check('ratingsAverage')
    .optional()
    .isNumeric()
    .withMessage('ratingsAverage must be a number')
    .isLength({ min: 1 })
    .withMessage('Rating must be above or equal 1.0')
    .isLength({ max: 5 })
    .withMessage('Rating must be below or equal 5.0'),
  check('ratingsQuantity')
    .optional()
    .isNumeric()
    .withMessage('ratingsQuantity must be a number'),

  validatorMiddleware,
];

export const getProductValidator = [
  check('id').isMongoId().withMessage('Invalid ID format'),
  validatorMiddleware,
];

export const updateProductValidator = [
  check('id').isMongoId().withMessage('Invalid ID format'),
  check('title')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

export const deleteProductValidator = [
  check('id').isMongoId().withMessage('Invalid ID format'),
  validatorMiddleware,
];
