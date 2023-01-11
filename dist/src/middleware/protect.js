"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_utils_1 = require("../utils/jwt.utils");
const globalVariables_1 = require("../config/globalVariables");
// This middleware is used to protect routes, deserialize the user from the JWT, and attach it to the res.locals object
const protect = async (req, res, next) => {
    try {
        const refreshToken = req.cookies[globalVariables_1.refreshTokenName];
        const { accessToken } = req.body;
        // If no access token, return 401
        if (!accessToken)
            return res.status(401).json({ message: "Unauthorized, no tokens provided" });
        const { decoded, valid, expired } = (0, jwt_utils_1.verifyJwt)(accessToken, globalVariables_1.accessTokenSecret);
        // If access token is invalid, return 401
        if (!valid) {
            res.clearCookie(globalVariables_1.refreshTokenName, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: 'strict',
            });
            return res.status(401).json({ message: "Unauthorized, invalid access token" });
        }
        // If access token is expired, create new access token after validating the refresh token
        if (expired) {
            // Verify refresh token
            const { decoded: decodedRefresh, valid: validRefresh, expired: expiredRefresh } = (0, jwt_utils_1.verifyJwt)(refreshToken, globalVariables_1.refreshTokenSecret);
            // If the resfresh token is invalid or expired, delete it from the cookies and make the user login again
            if (!validRefresh || expiredRefresh) {
                res.clearCookie(globalVariables_1.refreshTokenName, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: 'strict',
                });
                return res.status(401).json({ message: "Unauthorized, invalid refresh token" });
            }
            // If the refresh token is valid, create a new access token
            const newAccessToken = (0, jwt_utils_1.issueAccessToken)(decodedRefresh);
            res.locals.user = decodedRefresh;
            res.locals.accessToken = newAccessToken;
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