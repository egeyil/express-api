import xss from "xss";
import {NextFunction, Request, Response} from "express";

export const htmlSanitizer = (html: string) => {
  return async (req: Request, res:Response, next: NextFunction) => {
    try {
      // Test if the html is a string
      const htmlStr = html + '';
      // Sanitize the html
      const _html = xss(htmlStr);
      return next();
    }catch (e) {
      return res.status(400).json({message: "Invalid HTML", e});
    }
  }
}