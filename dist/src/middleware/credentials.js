"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const allowedOrigins_1 = __importDefault(require("../config/allowedOrigins"));
const credentials = (req, res, next) => {
    var _a;
    const origin = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.origin;
    if (origin && allowedOrigins_1.default.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', 'true');
    }
    next();
};
exports.default = credentials;
//# sourceMappingURL=credentials.js.map