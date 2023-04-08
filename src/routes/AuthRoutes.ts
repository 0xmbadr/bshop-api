import express from 'express';
import { signUpValidator } from '../utils/validators/AuthValidators';
import { signup } from '../services/AuthServices';
const router = express.Router();

router.route('/signup').post(signUpValidator, signup);
// router
//   .route('/:id')
//   .get(getUserValidator, getSingleUser)
//   .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
//   .delete(deleteUserValidator, deleteUser);

export default router;
