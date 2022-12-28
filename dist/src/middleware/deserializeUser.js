"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const jwt_utils_1 = require("../utils/jwt.utils");
const deserializeUser = async (req, res, next) => {
    try {
        const accessToken = req.cookies;
        const refreshToken = (0, lodash_1.get)(req, "headers.x-refresh");
        if (!accessToken) {
            return next();
        }
        const { decoded, expired } = (0, jwt_utils_1.verifyJwt)(accessToken, "accessTokenPublicKey");
        if (decoded) {
            res.locals.user = decoded;
            return next();
        }
        if (expired && refreshToken) {
            // const newAccessToken = await reIssueAccessToken({ refreshToken });
            //
            // if (newAccessToken) {
            //   res.setHeader("x-access-token", newAccessToken);
            // }
            //
            // const result = verifyJwt(newAccessToken as string, "accessTokenPublicKey");
            //
            // res.locals.user = result.decoded;
            // return next();
        }
        return next();
    }
    catch (e) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};
exports.default = deserializeUser;
//# sourceMappingURL=deserializeUser.js.map