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

const router = express.Router();

router.put(
  '/changePassword/:id',
  changeUserPasswordValidator,
  changeUserPassword,
);

router
  .route('/')
  .get(getUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, createUser);
router
  .route('/:id')
  .get(getUserValidator, getSingleUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

export default router;
