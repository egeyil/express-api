import {Request, Response, NextFunction} from "express";
import {issueAccessToken, signJwt, verifyJwt} from "../utils/jwt.utils";
import {
  accessTokenName, accessTokenSecret,
  refreshTokenName,
  refreshTokenSecret
} from "../config/globalVariables";
import jwt, {JwtPayload, VerifyErrors} from "jsonwebtoken";
import process from "process";

// This middleware is used to protect routes, deserialize the user from the JWT, and attach it to the res.locals object
const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies[accessTokenName];
    const refreshToken = req.cookies[refreshTokenName];

    if (!accessToken && !refreshToken) {
      return res.status(401).json({message: "Unauthorized"});
    }

    const refreshTokenCallback = (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
      try {
        if (err) {
          console.log(err)
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
          return res.status(401).json({message: "Unauthorized here"});
        } else {
          const newAccessToken = issueAccessToken(decoded as JwtPayload);
          res.cookie(accessTokenName, newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'none',
          });
          res.locals.user = decoded;
          return next();
        }
      } catch (e) {
        return res.status(500).json({message: "Internal server error"});
      }
    }
    const accessTokenCallback = (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
      try {
        if (err) {
          if (err.name === "TokenExpiredError") {
            // Verify refreshToken
            jwt.verify(refreshToken, refreshTokenSecret, refreshTokenCallback);
          } else {
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
            return res.status(401).json({message: "Unauthorized"});
          }
        }
        res.locals.user = decoded;
        return next();
      } catch (e) {
        return res.status(500).json({message: "Internal server error"});
      }
    }

    jwt.verify(accessToken, accessTokenSecret, accessTokenCallback);
  } catch (e) {
    return res.status(401).json({message: "Unauthorized"});
  }
};

export default protect;
