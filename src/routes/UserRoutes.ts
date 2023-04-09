import express from 'express';
import {
  changeUserPasswordValidator,
  createUserValidator,
  deleteUserValidator,
  getUserValidator,
  updateLoggedUserDataValidator,
  updateUserValidator,
} from '../utils/validators/UserValidators';
import {
  changeUserPassword,
  createUser,
  deleteLoggedUserData,
  deleteUser,
  getLoggedUserData,
  getSingleUser,
  getUsers,
  resizeImage,
  updateLoggedUserData,
  updateLoggedUserPassword,
  updateUser,
  uploadUserImage,
} from '../services/UserServices';
import { allowedTo, protect } from '../services/AuthServices';

const router = express.Router();

// protect all routes
router.use(protect);

router.get('/getMe', getLoggedUserData, getSingleUser);
router.put('/changeMyPassword', updateLoggedUserPassword);
router.put('/updateMe', updateLoggedUserDataValidator, updateLoggedUserData);
router.delete('/deactivate', deleteLoggedUserData);

// Admin
router.use(allowedTo('admin'));

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
