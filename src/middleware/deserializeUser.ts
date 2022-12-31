import {get} from "lodash";
import {Request, Response, NextFunction} from "express";
import {verifyJwt} from "../utils/jwt.utils";

// This middleware is used to deserialize the user from the JWT, and attach it to the res.locals object
const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies;

    const refreshToken = get(req, "headers.x-refresh");

    if (!accessToken) {
      return next();
    }

    const {decoded, expired} = verifyJwt(accessToken, "accessTokenPublicKey");

    if (decoded) {
      res.locals.user = decoded;
      return next();
    }

    if (expired && refreshToken) {
      // const newAccessToken = await reIssueAccessToken({ refreshToken });
      //
      // if (newAccessToken) {
      //   res.setHeader("x-access-token", newAccessToken);
      // }
      //
      // const result = verifyJwt(newAccessToken as string, "accessTokenPublicKey");
      //
      // res.locals.user = result.decoded;
      // return next();
    }

    return next();
  } catch (e) {
    return res.status(401).json({message: "Unauthorized"});
  }
};

export default deserializeUser;
