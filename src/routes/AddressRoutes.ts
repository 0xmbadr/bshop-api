import express from 'express';
import { protect, allowedTo } from './../services/AuthServices';

import {
  addAddress,
  removeAddress,
  getLoggedUserAddresses,
} from '../services/AddressServices';

const router = express.Router();

router.use(protect, allowedTo('user'));

router.route('/').post(addAddress).get(getLoggedUserAddresses);

router.delete('/:addressId', removeAddress);

export default router;
