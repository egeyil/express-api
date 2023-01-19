"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.issueRefreshToken = exports.issueAccessToken = exports.verifyJwt = exports.signJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const { accessTokenSecret, refreshTokenSecret, accessTokenExpiresIn, refreshTokenExpiresIn } = config_1.default;
// Create secrets with require('crypto').randomBytes(64).toString('hex')
function signJwt(object, secret, options) {
    console.log(secret);
    return jsonwebtoken_1.default.sign(object, secret, {
        ...(options && options),
    });
}
exports.signJwt = signJwt;
function verifyJwt(token, secretOrPublicKey, options) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secretOrPublicKey, options);
        return {
            decoded: decoded,
            valid: true,
            expired: false,
        };
    }
    catch (e) {
        if (e.name === "TokenExpiredError") {
            return {
                decoded: null,
                expired: true,
                valid: true,
            };
        }
        else {
            return {
                decoded: null,
                expired: false,
                valid: false,
            };
        }
    }
}
exports.verifyJwt = verifyJwt;
function issueAccessToken(user) {
    const csrfToken = Math.random().toString(36).slice(2);
    const accessToken = signJwt({
        username: user.username,
        email: user.email,
        roles: user.roles && Object.values(user.roles).filter(Boolean),
        csrfToken,
    }, accessTokenSecret, { expiresIn: accessTokenExpiresIn });
    return {
        accessToken,
        csrfToken
    };
}
exports.issueAccessToken = issueAccessToken;
function issueRefreshToken(user) {
    return signJwt({
        username: user.username,
    }, refreshTokenSecret, { expiresIn: refreshTokenExpiresIn });
}
exports.issueRefreshToken = issueRefreshToken;
//# sourceMappingURL=jwt.utils.js.map