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
import { allowedTo, protect } from '../services/AuthServices';

const router = express.Router();

router
  .route('/')
  .get(getBrands)
  .post(
    protect,
    allowedTo('manager', 'admin'),
    uploadBrandImage,
    resizeImage,
    createBrandValdiator,
    createBrand,
  );
router
  .route('/:id')
  .get(getBrandValidator, getSingleBrand)
  .put(
    protect,
    allowedTo('manager', 'admin'),
    uploadBrandImage,
    resizeImage,
    updateBrandValidator,
    updateBrand,
  )
  .delete(protect, allowedTo('admin'), deleteBrandValidator, deleteBrand);

export default router;
