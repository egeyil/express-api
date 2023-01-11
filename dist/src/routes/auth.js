"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/auth/authController");
const validate_1 = __importDefault(require("../middleware/validate"));
const user_schema_1 = require("../schema/user.schema");
const router = express_1.default.Router();
router.post('/register', (0, validate_1.default)(user_schema_1.RegisterSchema), authController_1.handleRegister);
router.post('/login', (0, validate_1.default)(user_schema_1.LoginSchema), authController_1.handleLogin);
// GET /api/auth/logout
router.get('/logout', authController_1.handleLogout);
router.get('/refresh-token', authController_1.handleRefreshToken);
// POST /api/auth/forgotPassword
// router.post('/forgotPassword', authController.forgotPassword);
// Protect all routes after this middleware
// router.use(authController.protect);
// router.patch('/resetPassword', authController.resetPassword);
exports.default = router;
//# sourceMappingURL=auth.js.map