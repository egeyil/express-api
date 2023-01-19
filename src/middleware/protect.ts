import {Request, Response, NextFunction} from "express";
import {issueAccessToken, verifyJwt} from "../utils/jwt.utils";
import config from "../config/config";
import {JwtPayload} from "jsonwebtoken";

const { accessTokenSecret, refreshTokenName, refreshTokenSecret } = config;

// This middleware is used to protect routes, deserialize the user from the JWT, and attach it to the res.locals object
const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies[refreshTokenName];
    const authHeader = req.headers.authorization;
    const csrfToken = req.headers['x-csrf-token'];
    if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({message: "Unauthorized, no access token provided"});
    const accessToken = authHeader.split(' ')[1];

    // If no access token, return 401
    if (!accessToken) return res.status(401).json({message: "Unauthorized, no access token provided"});

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

    // CSRF token validation
    if (!csrfToken || csrfToken !== decoded.csrfToken) return res.status(401).json({message: "Unauthorized, invalid CSRF token"});

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
      const {accessToken: newAccessToken, csrfToken} = issueAccessToken(decodedRefresh);

      res.locals.user = decodedRefresh;
      res.locals.accessToken = newAccessToken;
      res.locals.csrfToken = csrfToken;
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
