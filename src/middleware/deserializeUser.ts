import {get} from "lodash";
import {Request, Response, NextFunction} from "express";
import {issueAccessToken, signJwt, verifyJwt} from "../utils/jwt.utils";
import {accessTokenCookieOptions, accessTokenName, refreshTokenName} from "../config/globalVariables";
import process from "process";

// This middleware is used to deserialize the user from the JWT, and attach it to the res.locals object
const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies[accessTokenName];
    const refreshToken = req.cookies[refreshTokenName];

    if (!accessToken || !refreshToken) {
      return res.status(401).json({message: "Unauthorized"});
    }

    const {decoded, expired, valid} = verifyJwt(accessToken, accessTokenName);

    if (decoded && !expired && valid) {
      res.locals.user = decoded;
      return next();
    }

    // Verify refreshToken
    const {
      decoded: decodedRefreshToken,
      expired: expiredRefreshToken,
      valid: validRefreshToken
    } = verifyJwt(refreshToken, refreshTokenName);
    if (!decodedRefreshToken || expiredRefreshToken || !validRefreshToken) {
      return res.status(401).json({message: "Unauthorized, please log in again."});
    }

    // If there is a user but the access token is expired, and there is a valid refreshToken, we need to reissue a new token
    if (valid && decoded && typeof decoded === 'object' && expired && decodedRefreshToken) {
      res.locals.user = decoded;
      const newAccessToken = issueAccessToken(decoded);

      if (newAccessToken) {
        res.cookie(accessTokenName, accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: 'none',
          maxAge: 60 * 60 * 1000 // 1 hour
        });
        const result = verifyJwt(newAccessToken, accessTokenName);

        res.locals.user = result?.decoded;
        return next();
      }
    }

    return next();
  } catch (e) {
    return res.status(401).json({message: "Unauthorized"});
  }
};

export default deserializeUser;
