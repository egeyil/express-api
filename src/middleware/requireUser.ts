import { Request, Response, NextFunction } from "express";

// This middleware is used to check if a user is stored in the locals after the auth chain.
const requireUser = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;

  if (!user) {
    return res.sendStatus(403);
  }

  return next();
};

export default requireUser;
