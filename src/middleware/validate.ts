import {Request, Response, NextFunction} from "express";
import {AnyZodObject} from "zod";

// This middleware is used to validate the request against a schema that will be passed in when calling the function.
const validate = (schema: AnyZodObject) => {
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

export default validate;
