"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_utils_1 = require("../utils/jwt.utils");
const globalVariables_1 = require("../config/globalVariables");
// This middleware is used to protect routes, deserialize the user from the JWT, and attach it to the res.locals object
const protect = async (req, res, next) => {
    try {
        const accessToken = req.cookies[globalVariables_1.accessTokenName];
        const refreshToken = req.cookies[globalVariables_1.refreshTokenName];
        if (!accessToken && !refreshToken) {
            return res.status(401).json({ message: "Unauthorized, no tokens provided" });
        }
        const { decoded, valid, expired } = (0, jwt_utils_1.verifyJwt)(accessToken, globalVariables_1.accessTokenSecret);
        if (!valid) {
            res.clearCookie(globalVariables_1.refreshTokenName, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: 'none',
            });
            res.clearCookie(globalVariables_1.accessTokenName, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: 'none',
            });
            return res.status(401).json({ message: "Unauthorized, invalid access token" });
        }
        // If access token is expired, create new access token after validating the refresh token
        if (expired) {
            const { decoded: decodedRefresh, valid: validRefresh, expired: expiredRefresh } = (0, jwt_utils_1.verifyJwt)(refreshToken, globalVariables_1.refreshTokenSecret);
            if (!validRefresh || expiredRefresh) {
                res.clearCookie(globalVariables_1.refreshTokenName, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: 'none',
                });
                res.clearCookie(globalVariables_1.accessTokenName, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: 'none',
                });
                return res.status(401).json({ message: "Unauthorized, invalid refresh token" });
            }
            const newAccessToken = (0, jwt_utils_1.issueAccessToken)(decodedRefresh);
            res.cookie(globalVariables_1.accessTokenName, newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: 'none',
            });
            res.locals.user = decodedRefresh;
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