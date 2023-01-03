import jwt, {JwtPayload} from "jsonwebtoken";
import {accessTokenSecret, refreshTokenSecret} from "../config/globalVariables";

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
  }, accessTokenSecret, {expiresIn: "15s"})
}

export function issueRefreshToken(user: JwtPayload) {
  return signJwt({
    username: user.username,
  }, refreshTokenSecret, {expiresIn: "90d"})
}