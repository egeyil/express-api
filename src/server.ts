import express, {Request, Response} from "express";
import dotenv from "dotenv";
const app = express();
import path from 'path';
import cors from 'cors';
import corsOptions from "./utils/corsOptions";
import {logger} from './middleware/logEvents';
import errorHandler from './middleware/errorHandler';
import connectDB from './utils/dbConnect';
import credentials from './middleware/credentials';
import responseTime from "response-time";
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import config from "config";
import hpp from 'hpp';
import multer from 'multer';
import compression from 'compression';
import {restResponseTimeHistogram, startMetricsServer} from "./utils/metrics";
import swaggerDocs from "./utils/swagger";


dotenv.config();
const PORT = Number(process.env.PORT) || 3500;


// Connect to MongoDB
connectDB();

// Compress all responses
app.use(compression());

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({extended: false, limit: '30kb'}));
app.use(express.json({limit: '30kb'}));

// built-in middleware for json
app.use(express.json());

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
  max: 150,
  windowMs: 60 * 60 * 1000, // Limit each IP to make 150 requests per `window` (here, per hour)
  message: 'Too many requests from this IP, please try again in 15 minutes!',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use('/api', apiLimiter);


/* ***** ROUTES ***** */
// Import all routes
import auth from './routes/auth';

// Mount routers
app.use('/api/auth', auth);

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

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`)

  await connectDB();
  console.log('Connected to MongoDB');

  startMetricsServer();

  swaggerDocs(app, PORT);
});