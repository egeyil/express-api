import {NextFunction, Request, Response} from "express";

// This middleware is used to authorize a user based on the roles they have.
const verifyRoles = (...allowedRoles: [number]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req?.body?.JWT_roles) return res.sendStatus(401);
    const rolesArray = [...allowedRoles];
    const result = req.body.JWT_roles.map((role: number) => rolesArray.includes(role)).find((val: boolean) => val);
    if (!result) return res.sendStatus(401);
    next();
  }
}

export default verifyRoles