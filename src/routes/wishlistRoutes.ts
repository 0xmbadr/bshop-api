import express from 'express';
import { protect, allowedTo } from './../services/AuthServices';

import {
  addProductToWishlist,
  removeProductFromWishlist,
  getLoggedUserWishlist,
} from '../services/wishlistServices';

const router = express.Router();

router.use(protect, allowedTo('user'));

router.route('/').post(addProductToWishlist).get(getLoggedUserWishlist);

router.delete('/:productId', removeProductFromWishlist);

export default router;
