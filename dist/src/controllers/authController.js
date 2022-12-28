"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRegister = exports.handleLogin = void 0;
const User_model_1 = __importDefault(require("../model/User.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const isEmail_1 = __importDefault(require("validator/lib/isEmail"));
const jwt_utils_1 = require("../utils/jwt.utils");
const handleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user, password } = req.body;
        // If no user data or password provided, return error
        if (!user || !password)
            return res.status(400).json({ 'message': 'Username/email and password are required.' });
        // Check if user is email or username and query accordingly
        let foundUser = null;
        if ((0, isEmail_1.default)(user)) {
            foundUser = yield User_model_1.default.findOne({ email: user }).exec();
        }
        else {
            foundUser = yield User_model_1.default.findOne({ username: user }).exec();
        }
        // If no user found, return error
        if (!foundUser)
            return res.status(401).json({ message: "Incorrect username/email or password." });
        // evaluate password
        const match = yield bcrypt_1.default.compare(password, foundUser.password);
        if (!match)
            return res.status(401).json({ message: "Incorrect username/email or password." });
        // Get roles
        const roles = foundUser.roles && Object.values(foundUser.roles).filter(Boolean);
        // create JWTs
        const accessToken = (0, jwt_utils_1.signJwt)({
            UserInfo: {
                username: foundUser.username,
                email: foundUser.email,
                roles: roles,
            }
        }, "ACCESS_TOKEN_SECRET", { expiresIn: "15m" });
        const refreshToken = (0, jwt_utils_1.signJwt)({
            UserInfo: {
                username: foundUser.username,
            },
        }, "REFRESH_TOKEN_SECRET", { expiresIn: '90d' });
        // Saving refreshToken with current user
        foundUser.refreshToken = refreshToken;
        const result = yield foundUser.save();
        console.log(result);
        // Creates Secure Cookie with refresh token
        res.cookie(process.env.APP_NAME || 'REFRESH_TOKEN', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000
        });
        // Send authorization roles and access token to user
        res.json({ roles, accessToken });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.handleLogin = handleLogin;
const handleRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, displayName, email, password, confirmPassword } = req.body;
        if (!username || !displayName || !email || !password)
            return res.status(400).json({ 'message': 'Username, displayName, email and password are required.' });
        if (password !== confirmPassword)
            return res.status(400).json({ 'message': 'Passwords do not match.' });
        // check for duplicate usernames in the db
        const duplicate = yield User_model_1.default.findOne({ username: username }).exec();
        if (duplicate)
            return res.status(409).json({ message: "A user with this username already exists." }); //Conflict
        //encrypt the password
        const salt = yield bcrypt_1.default.genSalt();
        const hashedPwd = yield bcrypt_1.default.hash(password, salt);
        //create and store the new user
        const result = yield User_model_1.default.create({
            "username": username,
            "password": hashedPwd,
            "displayName": displayName,
            "email": email,
        });
        console.log(result);
        const createdUser = Object.assign(Object.assign({}, result.toObject()), { password: undefined });
        res.status(201).json({ message: "User created successfully.", user: { createdUser } });
    }
    catch (e) {
        return res.status(500).json({ message: "Something went wrong." });
    }
});
exports.handleRegister = handleRegister;
//# sourceMappingURL=authController.js.map