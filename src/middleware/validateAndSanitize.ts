import express, {Request, Response, NextFunction} from "express";
import {z, AnyZodObject} from "zod";

const validateAndSanitize = (schema: AnyZodObject, payloadType: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      return res.status(400).json({message: "Invalid Request", error});
    }
  }
}
