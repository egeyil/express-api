"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_utils_1 = require("../utils/jwt.utils");
const config_1 = __importDefault(require("../config/config"));
const { accessTokenSecret, refreshTokenName, refreshTokenSecret } = config_1.default;
// This middleware is used to protect routes, deserialize the user from the JWT, and attach it to the res.locals object
const protect = async (req, res, next) => {
    try {
        const refreshToken = req.cookies[refreshTokenName];
        const authHeader = req.headers.authorization;
        const csrfToken = req.headers['x-csrf-token'];
        if (!authHeader?.startsWith('Bearer '))
            return res.status(401).json({ message: "Unauthorized, no access token provided" });
        const accessToken = authHeader.split(' ')[1];
        // If no access token, return 401
        if (!accessToken)
            return res.status(401).json({ message: "Unauthorized, no access token provided" });
        const { decoded, valid, expired } = (0, jwt_utils_1.verifyJwt)(accessToken, accessTokenSecret);
        // If access token is invalid, return 401
        if (!valid) {
            res.clearCookie(refreshTokenName, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: 'strict',
            });
            return res.status(401).json({ message: "Unauthorized, invalid access token" });
        }
        // CSRF token validation
        if (!csrfToken || csrfToken !== decoded.csrfToken)
            return res.status(401).json({ message: "Unauthorized, invalid CSRF token" });
        // If access token is expired, create new access token after validating the refresh token
        if (expired) {
            // Verify refresh token
            const { decoded: decodedRefresh, valid: validRefresh, expired: expiredRefresh } = (0, jwt_utils_1.verifyJwt)(refreshToken, refreshTokenSecret);
            // If the resfresh token is invalid or expired, delete it from the cookies and make the user login again
            if (!validRefresh || expiredRefresh) {
                res.clearCookie(refreshTokenName, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: 'strict',
                });
                return res.status(401).json({ message: "Unauthorized, invalid refresh token" });
            }
            // If the refresh token is valid, create a new access token
            const { accessToken: newAccessToken, csrfToken } = (0, jwt_utils_1.issueAccessToken)(decodedRefresh);
            res.locals.user = decodedRefresh;
            res.locals.accessToken = newAccessToken;
            res.locals.csrfToken = csrfToken;
            return next();
        }
        res.locals.user = decoded;
        return next();
    }
    catch (e) {
        console.log(e);
        return res.status(401).json({ message: "Unauthorized" });
    }
};
exports.default = protect;
//# sourceMappingURL=protect.js.map