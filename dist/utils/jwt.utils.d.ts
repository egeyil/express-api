import jwt from "jsonwebtoken";
export declare function signJwt(object: Object, keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey", options?: jwt.SignOptions | undefined): string;
export declare function verifyJwt(token: string, keyName: "accessTokenPublicKey" | "refreshTokenPublicKey"): {
    valid: boolean;
    expired: boolean;
    decoded: string | jwt.JwtPayload;
} | {
    valid: boolean;
    expired: boolean;
    decoded: null;
};
