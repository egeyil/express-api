"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenSecret = exports.refreshTokenName = exports.accessTokenSecret = exports.accessTokenName = void 0;
const process_1 = __importDefault(require("process"));
exports.accessTokenName = process_1.default.env.APP_NAME ? process_1.default.env.APP_NAME + "_ACCESS_TOKEN" : "ACCESS_TOKEN";
exports.accessTokenSecret = process_1.default.env.ACCESS_TOKEN_SECRET ? process_1.default.env.ACCESS_TOKEN_SECRET : "02fbc7b8602b4cc282e2f78ee623b0bfb73f5148722207ba27efdf14cf6c06172f8ce32b534710417e4e1697c7e7f1ac6b46fed3e8385d40d362e865b1fbc796";
exports.refreshTokenName = process_1.default.env.APP_NAME ? process_1.default.env.APP_NAME + "_REFRESH_TOKEN" : "REFRESH_TOKEN";
exports.refreshTokenSecret = process_1.default.env.REFRESH_TOKEN_SECRET ? process_1.default.env.REFRESH_TOKEN_SECRET : "2f8108794cac61fc1ed87b19f49367e1a6223f5e67967d93e7eb98897cc345b52f0ae077f8678b290e74b1e0dea629dc90fddbea7747fc6ceea07438264a0eb3";
//# sourceMappingURL=globalVariables.js.map