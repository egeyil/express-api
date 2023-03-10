import dotenv from "dotenv";
dotenv.config();

import express, {Request, Response} from "express";
import path from 'path';
import cors from 'cors';
import corsOptions from "./utils/corsOptions";
import {logger} from './middleware/logEvents';
import credentials from './middleware/credentials';
import responseTime from "response-time";
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import multer from 'multer';
import compression from 'compression';
import {restResponseTimeHistogram, startMetricsServer} from "./utils/metrics";
import routes from "./routes";

const app = express();

// Compress all responses
app.use(compression());

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.json({limit: '30kb'}));

//middleware for cookies
app.use(cookieParser());

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// Set security HTTP headers
app.use(helmet());

// Prevent http param pollution
app.use(hpp());

// Data sanitization against XSS
//app.use(xss());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  app.use(logger)
}

// Limit requests from same IP to 150 per hour for API Routes
const apiLimiter = rateLimit({
  max: 200,
  windowMs: 10 * 60 * 1000, // Limit each IP to make 150 requests per `window` (here, per hour)
  message: 'Too many requests from this IP, please try again in 15 minutes!',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use('/api', apiLimiter);

// Limit requests from same IP to 150 per hour for API/AUTH Routes
const authLimiter = rateLimit({
  max: 40,
  windowMs: 10 * 60 * 1000, // Limit each IP to make 150 requests per `window` (here, per hour)
  message: 'Too many requests from this IP, please try again in 15 minutes!',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use('/api/auth', authLimiter);

// Mount routes
routes(app);

app.use(
  responseTime((req: Request, res: Response, time: number) => {
    if (req?.route?.path) {
      restResponseTimeHistogram.observe(
        {
          method: req.method,
          route: req.route.path,
          status_code: res.statusCode,
        },
        time * 1000
      );
    }
  })
);

export default app;
