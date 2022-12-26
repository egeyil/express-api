import { NextFunction, Request, Response } from "express";
declare const credentials: (req: Request, res: Response, next: NextFunction) => void;
export default credentials;
