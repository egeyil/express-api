"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const allowedOrigins_js_1 = __importDefault(require("../config/allowedOrigins.js"));
const corsOptions = {
    origin: (origin, callback) => {
        // Remove !origin if you do not want to allow requests with no origin (Server-to-server requests or local tools)
        if (origin && allowedOrigins_js_1.default.indexOf(origin) !== -1 || !origin) {
            return callback(null, true);
        }
        else {
            return callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
};
exports.default = corsOptions;
//# sourceMappingURL=corsOptions.js.map