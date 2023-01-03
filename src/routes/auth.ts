import express from 'express';
import {handleLogin, handleLogout, handleRegister} from '../controllers/authController';
import validate from "../middleware/validate";
import deserializeUser from "../middleware/protect";
import {LoginSchema, RegisterSchema} from "../schema/user.schema";

const router = express.Router();

router.post(
  '/register',
  validate(RegisterSchema),
  handleRegister,
);

router.post(
  '/login',
  validate(LoginSchema),
  handleLogin,
);

// GET /api/auth/logout
router.get('/logout',
  deserializeUser,
  handleLogout
);

// POST /api/auth/forgotPassword
// router.post('/forgotPassword', authController.forgotPassword);

// Protect all routes after this middleware
// router.use(authController.protect);
// router.patch('/resetPassword', authController.resetPassword);

export default router;