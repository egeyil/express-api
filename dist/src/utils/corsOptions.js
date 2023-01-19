"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config/config"));
const { allowedOrigins } = config_1.default;
const corsOptions = {
    origin: (origin, callback) => {
        // Remove !origin if you do not want to allow requests with no origin (Server-to-server requests or local tools)
        if (origin && allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }
        else if (process.env.NODE_ENV === 'development' && !origin) {
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