import jwt, {JwtPayload} from "jsonwebtoken";
import config from "../config/config";

const {  accessTokenSecret, refreshTokenSecret, accessTokenExpiresIn, refreshTokenExpiresIn } = config;
// Create secrets with require('crypto').randomBytes(64).toString('hex')

export function signJwt(object: Object, secret: string, options?: jwt.SignOptions | undefined) {
  console.log(secret)
  return jwt.sign(object, secret, {
    ...(options && options),
  });
}

export function verifyJwt(token: string, secretOrPublicKey: string, options?: jwt.VerifyOptions | undefined) {
  try {
    const decoded = jwt.verify(token, secretOrPublicKey, options);
    return {
      decoded: decoded,
      valid: true,
      expired: false,
    };
  } catch (e: any) {
    if (e.name === "TokenExpiredError") {
      return {
        decoded: null,
        expired: true,
        valid: true,
      }
    }
    else {
      return {
        decoded: null,
        expired: false,
        valid: false,
      }
    }
  }
}

export function issueAccessToken(user: JwtPayload) {
  const csrfToken = Math.random().toString(36).slice(2);
  const accessToken = signJwt({
    username: user.username,
    email: user.email,
    roles: user.roles && Object.values(user.roles).filter(Boolean),
    csrfToken,
  }, accessTokenSecret, {expiresIn: accessTokenExpiresIn});
  return {
    accessToken,
    csrfToken
  }
}

export function issueRefreshToken(user: JwtPayload) {
  return signJwt({
    username: user.username,
  }, refreshTokenSecret, {expiresIn: refreshTokenExpiresIn})
}