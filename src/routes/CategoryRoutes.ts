import express from 'express';
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
} from './../services/CategoryService';

const router = express.Router();

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
