import { Express, Request, Response } from "express";
import auth from './routes/auth';
import posts from './routes/post';

// We will handle routes in this file
const routes = (app: Express) => {
  // Mount routers
  app.use('/api/auth', auth);
  app.use('/api/posts', posts);
}

export default routes;