import express from 'express';
import {handleLogin} from '../controllers/authController';
import validate from "../middleware/validate";
import deserializeUser from "../middleware/deserializeUser";
import { UserSchema } from "../schema/user.schema";

const router = express.Router();

// router.post(
//   '/register',
//   validateRegister(),
//   validate,
//   authController.register,
//   authController.createAndSendToken
// );

router.post(
  '/login',
  validate(UserSchema),
  handleLogin,
);

// GET /api/auth/logout
// router.get('/logout', authController.logout);

// POST /api/auth/forgotPassword
// router.post('/forgotPassword', authController.forgotPassword);

// Protect all routes after this middleware
// router.use(authController.protect);
// router.patch('/resetPassword', authController.resetPassword);

module.exports = router;