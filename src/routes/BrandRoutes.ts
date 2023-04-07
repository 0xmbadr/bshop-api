import express from 'express';
import {
  deleteBrandValidator,
  getBrandValidator,
  updateBrandValidator,
  createBrandValdiator,
} from './../utils/validators/BrandValidators';
import {
  createBrand,
  deleteBrand,
  getBrands,
  getSingleBrand,
  resizeImage,
  updateBrand,
  uploadBrandImage,
} from '../services/BrandServices';

const router = express.Router();

router
  .route('/')
  .get(getBrands)
  .post(uploadBrandImage, resizeImage, createBrandValdiator, createBrand);
router
  .route('/:id')
  .get(getBrandValidator, getSingleBrand)
  .put(uploadBrandImage, resizeImage, updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);

export default router;
