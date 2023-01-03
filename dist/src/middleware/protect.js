"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_utils_1 = require("../utils/jwt.utils");
const globalVariables_1 = require("../config/globalVariables");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const process_1 = __importDefault(require("process"));
// This middleware is used to protect routes, deserialize the user from the JWT, and attach it to the res.locals object
const protect = async (req, res, next) => {
    try {
        const accessToken = req.cookies[globalVariables_1.accessTokenName];
        const refreshToken = req.cookies[globalVariables_1.refreshTokenName];
        if (!accessToken && !refreshToken) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const refreshTokenCallback = (err, decoded) => {
            try {
                if (err) {
                    console.log(err);
                    res.clearCookie(globalVariables_1.refreshTokenName, {
                        httpOnly: true,
                        secure: process_1.default.env.NODE_ENV === "production",
                        sameSite: 'none',
                    });
                    res.clearCookie(globalVariables_1.accessTokenName, {
                        httpOnly: true,
                        secure: process_1.default.env.NODE_ENV === "production",
                        sameSite: 'none',
                    });
                    return res.status(401).json({ message: "Unauthorized here" });
                }
                else {
                    const newAccessToken = (0, jwt_utils_1.issueAccessToken)(decoded);
                    res.cookie(globalVariables_1.accessTokenName, newAccessToken, {
                        httpOnly: true,
                        secure: process_1.default.env.NODE_ENV === "production",
                        sameSite: 'none',
                    });
                    res.locals.user = decoded;
                    return next();
                }
            }
            catch (e) {
                return res.status(500).json({ message: "Internal server error" });
            }
        };
        const accessTokenCallback = (err, decoded) => {
            try {
                if (err) {
                    if (err.name === "TokenExpiredError") {
                        // Verify refreshToken
                        jsonwebtoken_1.default.verify(refreshToken, globalVariables_1.refreshTokenSecret, refreshTokenCallback);
                    }
                    else {
                        res.clearCookie(globalVariables_1.refreshTokenName, {
                            httpOnly: true,
                            secure: process_1.default.env.NODE_ENV === "production",
                            sameSite: 'none',
                        });
                        res.clearCookie(globalVariables_1.accessTokenName, {
                            httpOnly: true,
                            secure: process_1.default.env.NODE_ENV === "production",
                            sameSite: 'none',
                        });
                        return res.status(401).json({ message: "Unauthorized" });
                    }
                }
                res.locals.user = decoded;
                return next();
            }
            catch (e) {
                return res.status(500).json({ message: "Internal server error" });
            }
        };
        jsonwebtoken_1.default.verify(accessToken, globalVariables_1.accessTokenSecret, accessTokenCallback);
    }
    catch (e) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};
exports.default = protect;
//# sourceMappingURL=protect.js.map