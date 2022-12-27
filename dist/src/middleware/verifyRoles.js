"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        var _a;
        if (!((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.JWT_roles))
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