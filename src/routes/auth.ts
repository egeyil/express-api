import express from 'express';
import {
  handleLogin,
  handleLogout,
  handleRegister,
  handleRefreshToken,
} from '../controllers/auth/authController';
import validate from "../middleware/validate";
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
  handleLogout,
);

router.get('/refresh-token',
  handleRefreshToken,
);

// POST /api/auth/forgotPassword
// router.post('/forgotPassword', authController.forgotPassword);

// Protect all routes after this middleware
// router.use(authController.protect);
// router.patch('/resetPassword', authController.resetPassword);

export default router;