"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.issueRefreshToken = exports.issueAccessToken = exports.verifyJwt = exports.signJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const globalVariables_1 = require("../config/globalVariables");
// Create secrets with require('crypto').randomBytes(64).toString('hex')
function signJwt(object, secret, options) {
    return jsonwebtoken_1.default.sign(object, secret, {
        ...(options && options),
    });
}
exports.signJwt = signJwt;
function verifyJwt(token, secret, options) {
    return jsonwebtoken_1.default.verify(token, secret);
}
exports.verifyJwt = verifyJwt;
function issueAccessToken(user) {
    return signJwt({
        username: user.username,
        email: user.email,
        roles: user.roles && Object.values(user.roles).filter(Boolean),
    }, globalVariables_1.accessTokenSecret, { expiresIn: "15s" });
}
exports.issueAccessToken = issueAccessToken;
function issueRefreshToken(user) {
    return signJwt({
        username: user.username,
    }, globalVariables_1.refreshTokenSecret, { expiresIn: "90d" });
}
exports.issueRefreshToken = issueRefreshToken;
//# sourceMappingURL=jwt.utils.js.map