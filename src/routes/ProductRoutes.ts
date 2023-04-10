import express from 'express';

import {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} from '../utils/validators/ProductValidator';

import {
  getProducts,
  getSingleProdcut,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImages,
} from '../services/ProdcutServices';
import { allowedTo, protect } from '../services/AuthServices';
import ReviewRoutes from './ReviewRoutes';

const router = express.Router();

router.use('/:productId/reviews', ReviewRoutes);

router
  .route('/')
  .get(getProducts)
  .post(
    protect,
    allowedTo('manager', 'admin'),
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProduct,
  );
router
  .route('/:id')
  .get(getProductValidator, getSingleProdcut)
  .put(
    protect,
    allowedTo('manager', 'admin'),
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct,
  )
  .delete(protect, allowedTo('admin'), deleteProductValidator, deleteProduct);

export default router;
