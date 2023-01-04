"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLogout = exports.handleRegister = exports.handleLogin = void 0;
const User_model_1 = __importDefault(require("../model/User.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const isEmail_1 = __importDefault(require("validator/lib/isEmail"));
const jwt_utils_1 = require("../utils/jwt.utils");
const process = __importStar(require("process"));
const globalVariables_1 = require("../config/globalVariables");
const handleLogin = async (req, res) => {
    try {
        const { user, password } = req.body;
        // If no user data or password provided, return error
        if (!user || !password)
            return res.status(400).json({ 'message': 'Username/email and password are required.' });
        // Check if user is email or username and query accordingly
        let foundUser;
        if ((0, isEmail_1.default)(user)) {
            foundUser = await User_model_1.default.findOne({ email: user }).exec();
        }
        else {
            foundUser = await User_model_1.default.findOne({ username: user }).exec();
        }
        // If no user found, return error
        if (!foundUser)
            return res.status(401).json({ message: "Incorrect username/email or password." });
        // evaluate password
        const match = await bcrypt_1.default.compare(password, foundUser.password);
        if (!match)
            return res.status(401).json({ message: "Incorrect username/email or password." });
        // Get roles
        const roles = foundUser.roles && Object.values(foundUser.roles).filter(Boolean);
        // create JWTs
        const accessToken = (0, jwt_utils_1.issueAccessToken)(foundUser);
        const refreshToken = (0, jwt_utils_1.issueRefreshToken)(foundUser);
        // Saving refreshToken with current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        // Creates Secure Cookie with refresh token
        res.cookie(globalVariables_1.refreshTokenName, refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'none',
        });
        res.cookie(globalVariables_1.accessTokenName, accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'none',
        });
        // Send authorization roles and access token to user
        res.json({
            message: "Login successful",
            user: {
                roles: result.roles,
                username: result.username,
                email: result.email,
                posts: result.posts,
            }
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.handleLogin = handleLogin;
const handleRegister = async (req, res) => {
    try {
        const { username, displayName, email, password, confirmPassword } = req.body;
        if (!username || !displayName || !email || !password)
            return res.status(400).json({ 'message': 'Username, displayName, email and password are required.' });
        if (password !== confirmPassword)
            return res.status(400).json({ 'message': 'Passwords do not match.' });
        // check for duplicate usernames/emails in the db
        const duplicateUser = await User_model_1.default.findOne({ $or: [{ username: username }, { email: email }] }).exec();
        if (duplicateUser) {
            let duplicateError = duplicateUser.username === username ? 'username' : 'email';
            return res.status(409).json({ message: `A user with this ${duplicateError} already exists.` }); //Conflict
        }
        //encrypt the password
        const salt = await bcrypt_1.default.genSalt();
        const hashedPwd = await bcrypt_1.default.hash(password, salt);
        //create and store the new user
        const result = await User_model_1.default.create({
            "username": username,
            "password": hashedPwd,
            "displayName": displayName,
            "email": email,
        });
        const createdUser = { ...result.toObject(), password: undefined };
        res.status(201).json({ message: "User created successfully.", user: { createdUser } });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Something went wrong." });
    }
};
exports.handleRegister = handleRegister;
const handleLogout = async (req, res) => {
    try {
        // On client, also delete the accessToken
        const cookies = req.cookies;
        if (!cookies || !cookies[globalVariables_1.refreshTokenName])
            return res.status(400).json({ message: "No cookies found." }); //No content
        const refreshToken = cookies[globalVariables_1.refreshTokenName];
        // Is refreshToken in db?
        const foundUser = await User_model_1.default.findOne({ refreshToken }).exec();
        if (!foundUser) {
            res.clearCookie(globalVariables_1.refreshTokenName, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: 'none',
            });
            res.clearCookie(globalVariables_1.accessTokenName, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: 'none',
            });
            return res.status(204).json({ message: "No user found." });
        }
        // Delete refreshToken in db
        foundUser.refreshToken = undefined;
        const result = await foundUser.save();
        res.clearCookie(globalVariables_1.refreshTokenName, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'none',
        });
        res.clearCookie(globalVariables_1.accessTokenName, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'none',
        });
        return res.status(200).json({
            message: "User logged out successfully.",
            user: {
                roles: result.roles,
                username: result.username,
                email: result.email,
            }
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.handleLogout = handleLogout;
//# sourceMappingURL=authController.js.map