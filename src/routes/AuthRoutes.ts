import express from 'express';
import {
  loginValidator,
  signupValidator,
} from '../utils/validators/AuthValidators';
import {
  forgetPassword,
  login,
  resetPassword,
  signup,
  verifyResetCode,
} from '../services/AuthServices';
const router = express.Router();

router.post('/signup', signupValidator, signup);
router.post('/login', loginValidator, login);
router.post('/forgetPassword', forgetPassword);
router.post('/verifyPassword', verifyResetCode);
router.put('/resetPassword', resetPassword);

export default router;
