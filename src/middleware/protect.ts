import {Request, Response, NextFunction} from "express";
import {issueAccessToken, verifyJwt} from "../utils/jwt.utils";
import {
  accessTokenSecret,
  refreshTokenName,
  refreshTokenSecret
} from "../config/globalVariables";
import {JwtPayload} from "jsonwebtoken";

// This middleware is used to protect routes, deserialize the user from the JWT, and attach it to the res.locals object
const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies[refreshTokenName];
    const {accessToken} = req.body;

    // If no access token, return 401
    if (!accessToken) return res.status(401).json({message: "Unauthorized, no tokens provided"});

    const {decoded, valid, expired} = verifyJwt(accessToken, accessTokenSecret) as JwtPayload;

    // If access token is invalid, return 401
    if (!valid) {
      res.clearCookie(refreshTokenName, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'strict',
      })
      return res.status(401).json({message: "Unauthorized, invalid access token"});
    }

    // If access token is expired, create new access token after validating the refresh token
    if (expired) {
      // Verify refresh token
      const {
        decoded: decodedRefresh,
        valid: validRefresh,
        expired: expiredRefresh
      } = verifyJwt(refreshToken, refreshTokenSecret) as JwtPayload;

      // If the resfresh token is invalid or expired, delete it from the cookies and make the user login again
      if (!validRefresh || expiredRefresh) {
        res.clearCookie(refreshTokenName, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: 'strict',
        })
        return res.status(401).json({message: "Unauthorized, invalid refresh token"});
      }

      // If the refresh token is valid, create a new access token
      const newAccessToken = issueAccessToken(decodedRefresh);

      res.locals.user = decodedRefresh;
      res.locals.accessToken = newAccessToken;
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
