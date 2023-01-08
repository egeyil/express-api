import { Express, Request, Response } from "express";
import auth from './routes/auth';
import posts from './routes/post';
import errorHandler from "./middleware/errorHandler";

// We will handle routes in this file
const routes = (app: Express) => {
  // Mount routers
  app.use('/api/auth', auth);
  app.use('/api/posts', posts);

  app.use(errorHandler);

  app.all('*', (req: Request, res: Response) => {
    res.status(404);
    if (req.accepts('html')) {
      res.json({"error": "404 Not Found"});
      // res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
      res.json({"error": "404 Not Found"});
    } else {
      res.type('txt').send("404 Not Found");
    }
  });
}

export default routes;