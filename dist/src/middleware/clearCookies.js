"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCookies = void 0;
const globalVariables_1 = require("../config/globalVariables");
const clearCookies = (req, res, next) => {
    try {
        if (res.locals.skip)
            return next();
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
        res.status(res.locals.status || 401).json(res.locals.body || { message: "Unauthorized" });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Internal server error." });
    }
};
exports.clearCookies = clearCookies;
//# sourceMappingURL=clearCookies.js.map