import express from 'express';
import {
  createSubCategoryValidator,
  deleteSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
} from './../utils/validators/SubCategoryValidators';
import {
  createFilterObj,
  createSubCategory,
  deleteSubCategory,
  getSingleSubCategory,
  getSubCategories,
  setCategoryIdToBody,
  updateSubCategory,
} from './../services/SubCategoryServices';
import { protect, allowedTo } from '../services/AuthServices';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(
    protect,
    allowedTo('manager', 'admin'),
    setCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory,
  )
  .get(createFilterObj, getSubCategories);
router
  .route('/:id')
  .get(getSubCategoryValidator, getSingleSubCategory)
  .put(
    protect,
    allowedTo('manager', 'admin'),
    updateSubCategoryValidator,
    updateSubCategory,
  )
  .delete(
    protect,
    allowedTo('admin'),
    deleteSubCategoryValidator,
    deleteSubCategory,
  );

export default router;
