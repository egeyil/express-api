import jwt, {JwtPayload} from "jsonwebtoken";
import {accessTokenName, refreshTokenName} from "../config/globalVariables";

// Create secrets with require('crypto').randomBytes(64).toString('hex')

export function signJwt(object: Object, secret: string, options?: jwt.SignOptions | undefined) {
  return jwt.sign(object, secret, {
    ...(options && options),
  });
}

export function verifyJwt(token: string, secret: string, options?: jwt.VerifyOptions | undefined) {
  return jwt.verify(token, secret);
}

export function issueAccessToken(user: JwtPayload) {
  return signJwt({
    username: user.username,
    email: user.email,
    roles: user.roles && Object.values(user.roles).filter(Boolean),
  }, accessTokenName, {expiresIn: "15m"})
}

export function issueRefreshToken(user: JwtPayload) {
  return signJwt({
    username: user.username,
  }, accessTokenName, {expiresIn: "90d"})
}