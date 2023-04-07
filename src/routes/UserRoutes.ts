import express from 'express';
import { createUserValidator } from '../utils/validators/UserValidators';
import {
  createUser,
  deleteUser,
  getSingleUser,
  getUsers,
  resizeImage,
  updateUser,
  uploadUserImage,
} from '../services/UserServices';

const router = express.Router();

router
  .route('/')
  .get(getUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, createUser);
router
  .route('/:id')
  .get(getSingleUser)
  .put(uploadUserImage, resizeImage, updateUser)
  .delete(deleteUser);

export default router;
