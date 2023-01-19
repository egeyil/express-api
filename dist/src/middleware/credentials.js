"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config/config"));
const { allowedOrigins } = config_1.default;
// This middleware is used to set the CORS headers
const credentials = (req, res, next) => {
    const origin = req.headers?.origin;
    if ((origin && allowedOrigins.includes(origin)) || !origin) {
        res.header('Access-Control-Allow-Credentials', 'true');
    }
    next();
};
exports.default = credentials;
//# sourceMappingURL=credentials.js.map