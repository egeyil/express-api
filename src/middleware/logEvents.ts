import {format} from 'date-fns';
import {v4 as uuid} from 'uuid';

import fs from 'fs';
import path from 'path';
import {NextFunction, Request, Response} from "express";
import * as process from "process";
const fsPromises = fs.promises;

export const logEvents = async (message: string, logName: string) => {
  const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
      await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
    }

    await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logName), logItem);
  } catch (err) {
    console.log(err);
  }
}

export const logger = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(req.cookies, req.body);
  }
  if (process.env.NODE_ENV === 'production') {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}\t${req.body}`, 'reqLog.txt');
  }
  next();
}
