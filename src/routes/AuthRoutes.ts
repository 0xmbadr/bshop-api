import express from 'express';
import {
  loginValidator,
  signupValidator,
} from '../utils/validators/AuthValidators';
import { login, signup } from '../services/AuthServices';
const router = express.Router();

router.route('/signup').post(signupValidator, signup);
router.route('/login').post(loginValidator, login);
// router
//   .route('/:id')
//   .get(getUserValidator, getSingleUser)
//   .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
//   .delete(deleteUserValidator, deleteUser);

export default router;
