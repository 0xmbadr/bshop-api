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

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(setCategoryIdToBody, createSubCategoryValidator, createSubCategory)
  .get(createFilterObj, getSubCategories);
router
  .route('/:id')
  .get(getSubCategoryValidator, getSingleSubCategory)
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory);

export default router;
