"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// This middleware is used to check if a user is stored in the locals after the auth chain.
const requireUser = (req, res, next) => {
    const user = res.locals.user;
    if (!user) {
        return res.sendStatus(403);
    }
    return next();
};
exports.default = requireUser;
//# sourceMappingURL=requireUser.js.map