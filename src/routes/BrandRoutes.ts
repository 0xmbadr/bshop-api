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
  updateBrand,
} from '../services/BrandServices';

const router = express.Router();

router.route('/').get(getBrands).post(createBrandValdiator, createBrand);
router
  .route('/:id')
  .get(getBrandValidator, getSingleBrand)
  .put(updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);

export default router;
