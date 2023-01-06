import { logEvents } from './logEvents';
import {NextFunction, Request, Response} from "express";

// This middleware is used as a global error handler. It will catch any errors
const errorHandler = async (err: Error, req: Request, res: Response, next: NextFunction) => {
  await logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
  console.error(err.stack)
  res.status(500).json({ "error": "500 Internal Server Error" });
}

export default errorHandler;