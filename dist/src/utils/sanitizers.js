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
exports.htmlSanitizer = void 0;
const xss_1 = __importDefault(require("xss"));
const htmlSanitizer = (html) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
    });
};
exports.htmlSanitizer = htmlSanitizer;
//# sourceMappingURL=sanitizers.js.map