import jwt from "jsonwebtoken";
import config from "config";
import * as process from "process";

// Create secrets with require('crypto').randomBytes(64).toString('hex')

export function signJwt(object: Object, secret: string, options?: jwt.SignOptions | undefined) {
  const signingKey = Buffer.from(
    process.env[secret] || "",
    "base64"
  ).toString("ascii");

  return jwt.sign(object, signingKey, {
    ...(options && options),
  });
}

export function verifyJwt(token: string, keyName: "accessTokenPublicKey" | "refreshTokenPublicKey") {
  const publicKey = Buffer.from(config.get<string>(keyName), "base64").toString(
    "ascii"
  );

  try {
    const decoded = jwt.verify(token, publicKey);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e: any) {
    console.error(e);
    return {
      valid: false,
      expired: e.message === "jwt expired",
      decoded: null,
    };
  }
}
