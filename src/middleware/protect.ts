import {Request, Response, NextFunction} from "express";
import {issueAccessToken, verifyJwt} from "../utils/jwt.utils";
import {
  accessTokenName, accessTokenSecret,
  refreshTokenName,
  refreshTokenSecret
} from "../config/globalVariables";
import {JwtPayload} from "jsonwebtoken";

// This middleware is used to protect routes, deserialize the user from the JWT, and attach it to the res.locals object
const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies[accessTokenName];
    const refreshToken = req.cookies[refreshTokenName];

    if (!accessToken && !refreshToken) {
      return res.status(401).json({message: "Unauthorized, no tokens provided"});
    }

    const {decoded, valid, expired} = verifyJwt(accessToken, accessTokenSecret) as JwtPayload;

    if (!valid) {
      res.clearCookie(refreshTokenName, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'none',
      })
      res.clearCookie(accessTokenName, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'none',
      });
      return res.status(401).json({message: "Unauthorized, invalid access token"});
    }

    // If access token is expired, create new access token after validating the refresh token
    if (expired) {
      const { decoded: decodedRefresh, valid: validRefresh, expired: expiredRefresh} = verifyJwt(refreshToken, refreshTokenSecret) as JwtPayload;
      if (!validRefresh || expiredRefresh) {
        res.clearCookie(refreshTokenName, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: 'none',
        })
        res.clearCookie(accessTokenName, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: 'none',
        });
        return res.status(401).json({message: "Unauthorized, invalid refresh token"});
      }
      const newAccessToken = issueAccessToken(decodedRefresh);
      res.cookie(accessTokenName, newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'none',
      });
      res.locals.user = decodedRefresh;
      return next();
    }

    res.locals.user = decoded;
    return next();
  } catch (e) {
    console.log(e)
    return res.status(401).json({message: "Unauthorized"});
  }
};

export default protect;
