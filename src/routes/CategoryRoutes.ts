import express from 'express';
import SubCategoryRoutes from './SubCategoryRoutes';
import {
  createCategoryValidator,
  deleteCategoryValidator,
  getCategoryValidator,
  updateCategoryValidator,
} from './../utils/validators/CategoryValidators';
import {
  createCategory,
  deleteCategory,
  getCategories,
  getSingleCategory,
  updateCategory,
} from '../services/CategoryServices';

const router = express.Router();

router.use('/:categoryId/subcategories', SubCategoryRoutes);

router
  .route('/')
  .get(getCategories)
  .post(createCategoryValidator, createCategory);
router
  .route('/:id')
  .get(getCategoryValidator, getSingleCategory)
  .put(updateCategoryValidator, updateCategory)
  .delete(deleteCategoryValidator, deleteCategory);

export default router;
