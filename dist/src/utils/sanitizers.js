"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.htmlSanitizer = void 0;
const xss_1 = __importDefault(require("xss"));
const htmlSanitizer = (html) => {
    return async (req, res, next) => {
        try {
            // Test if the html is a string
            const htmlStr = html + '';
            // Sanitize the html
            const _html = (0, xss_1.default)(htmlStr);
            return next();
        }
        catch (e) {
            return res.status(400).json({ message: "Invalid HTML", e });
        }
    };
};
exports.htmlSanitizer = htmlSanitizer;
//# sourceMappingURL=sanitizers.js.map