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
}

export default routes;