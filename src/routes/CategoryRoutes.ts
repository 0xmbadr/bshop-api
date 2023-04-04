import express from 'express';
import {
  createCategory,
  deleteCategory,
  getCategories,
  getSingleCategory,
  updateCategory,
} from './../services/CategoryService';

const router = express.Router();

router.route('/').get(getCategories).post(createCategory);
router
  .route('/:id')
  .get(getSingleCategory)
  .put(updateCategory)
  .delete(deleteCategory);

export default router;
