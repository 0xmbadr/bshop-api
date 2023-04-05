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
} from '../services/ProdcutServices';

const router = express.Router();

router.route('/').get(getProducts).post(createProductValidator, createProduct);
router
  .route('/:id')
  .get(getProductValidator, getSingleProdcut)
  .put(updateProductValidator, updateProduct)
  .delete(deleteProductValidator, deleteProduct);

export default router;
