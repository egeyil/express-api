"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenCookieOptions = exports.accessTokenCookieOptions = exports.refreshTokenName = exports.accessTokenName = void 0;
const process_1 = __importDefault(require("process"));
exports.accessTokenName = process_1.default.env.APP_NAME ? process_1.default.env.APP_NAME + "_ACCESS_TOKEN" : "ACCESS_TOKEN";
exports.refreshTokenName = process_1.default.env.APP_NAME ? process_1.default.env.APP_NAME + "_REFRESH_TOKEN" : "REFRESH_TOKEN";
exports.accessTokenCookieOptions = {
    httpOnly: true,
    secure: process_1.default.env.NODE_ENV === "production",
    sameSite: 'none',
    maxAge: 60 * 60 * 1000 // 1 hour
};
exports.refreshTokenCookieOptions = {
    httpOnly: true,
    secure: process_1.default.env.NODE_ENV === "production",
    sameSite: 'none',
    maxAge: 90 * 24 * 60 * 60 * 1000 // 90 days
};
//# sourceMappingURL=globalVariables.js.map