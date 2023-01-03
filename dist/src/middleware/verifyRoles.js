"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// This middleware is used to authorize a user based on the roles they have.
const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.body?.JWT_roles)
            return res.sendStatus(401);
        const rolesArray = [...allowedRoles];
        const result = req.body.JWT_roles.map((role) => rolesArray.includes(role)).find((val) => val);
        if (!result)
            return res.sendStatus(401);
        next();
    };
};
exports.default = verifyRoles;
//# sourceMappingURL=verifyRoles.js.map