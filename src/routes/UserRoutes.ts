import express from 'express';
import {
  changeUserPasswordValidator,
  createUserValidator,
  deleteUserValidator,
  getUserValidator,
  updateUserValidator,
} from '../utils/validators/UserValidators';
import {
  changeUserPassword,
  createUser,
  deleteUser,
  getSingleUser,
  getUsers,
  resizeImage,
  updateUser,
  uploadUserImage,
} from '../services/UserServices';
import { allowedTo, protect } from '../services/AuthServices';

const router = express.Router();

router.put(
  '/changePassword/:id',
  changeUserPasswordValidator,
  changeUserPassword,
);

router
  .route('/')
  .get(protect, allowedTo('admin'), getUsers)
  .post(
    protect,
    allowedTo('admin'),
    uploadUserImage,
    resizeImage,
    createUserValidator,
    createUser,
  );
router
  .route('/:id')
  .get(protect, allowedTo('admin'), getUserValidator, getSingleUser)
  .put(
    protect,
    allowedTo('admin'),
    uploadUserImage,
    resizeImage,
    updateUserValidator,
    updateUser,
  )
  .delete(protect, allowedTo('admin'), deleteUserValidator, deleteUser);

export default router;
