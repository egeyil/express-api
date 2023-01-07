"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("./routes/auth"));
const post_1 = __importDefault(require("./routes/post"));
// We will handle routes in this file
const routes = (app) => {
    // Mount routers
    app.use('/api/auth', auth_1.default);
    app.use('/api/posts', post_1.default);
};
exports.default = routes;
//# sourceMappingURL=routes.js.map