import jwt, {JwtPayload} from "jsonwebtoken";
import {accessTokenName, refreshTokenName} from "../config/globalVariables";

// Create secrets with require('crypto').randomBytes(64).toString('hex')

export function signJwt(object: Object, keyName: string, options?: jwt.SignOptions | undefined) {
  try {
    const signingKey = Buffer.from(
      keyName,
      "base64"
    ).toString("ascii");

    return jwt.sign(object, signingKey, {
      ...(options && options),
    });
  } catch (e: any) {
    console.log(e);
    return undefined;
  }
}

export function verifyJwt(token: string, keyName: string, options?: jwt.VerifyOptions | undefined) {
  try {
    const publicKey = Buffer.from(keyName, "base64").toString(
      "ascii"
    );
    const decoded = jwt.verify(token, publicKey);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e: any) {
    console.error(e);
    return {
      valid: e.name !== "TokenExpiredError",
      expired: e.name === "TokenExpiredError",
      decoded: undefined,
    };
  }
}

export function issueAccessToken(user: JwtPayload) {
  return signJwt({
    UserInfo: {
      username: user.username,
      email: user.email,
      roles: user.roles && Object.values(user.roles).filter(Boolean),
    },
  }, accessTokenName, {expiresIn: "15m"})
}

export function issueRefreshToken(user: JwtPayload) {
  return signJwt({
    UserInfo: {
      username: user.username,
    },
  }, accessTokenName, {expiresIn: "90d"})
}