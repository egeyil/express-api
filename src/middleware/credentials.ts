import { NextFunction, Request, Response } from "express";

import allowedOrigins from '../config/allowedOrigins';

// This middleware is used to set the CORS headers
const credentials = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers?.origin;
  if ((origin && allowedOrigins.includes(origin)) || !origin) {
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  next();
}

export default credentials

