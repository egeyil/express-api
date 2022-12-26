import express, { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import config from "config";
const app = express();
import path from 'path';
import cors from 'cors';
import corsOptions from './utils/corsOptions.js';
import { logger } from './middleware/logEvents.js';
import errorHandler from './middleware/errorHandler.js';
import connectDB from './utils/dbConnect.js';
import credentials from './middleware/credentials.js';
import responseTime from "response-time";
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
const PORT = process.env.PORT || 3500;
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import multer from 'multer';
import compression from 'compression';
import validator from 'validator';
import { restResponseTimeHistogram, startMetricsServer } from "./utils/metrics";
import swaggerDocs from "./utils/swagger";

// Connect to MongoDB
connectDB();

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false, limit: '30kb' }));
app.use(express.json({ limit: '30kb' }));

// built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// Set security HTTP headers
app.use(helmet());

// Data sanitization against XSS
//app.use(xss());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
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

// const auth = require('./routes/auth');
// const feed = require('./routes/feed');
// const user = require('./routes/user');
// const book = require('./routes/book');

/* ****************** */

// routes
// app.use('/', require('./routes/root'));
// app.use('/register', require('./routes/register'));
// app.use('/auth', require('./routes/auth'));
// app.use('/refresh', require('./routes/refresh'));
// app.use('/logout', require('./routes/logout'));
//
// app.use(verifyJWT);
// app.use('/employees', require('./routes/api/employees'));
// app.use('/users', require('./routes/api/users'));

app.all('*', (req: Request, res: Response) => {
  res.status(404);
  if (req.accepts('html')) {
    res.json({ "error": "404 Not Found" });
    // res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ "error": "404 Not Found" });
  } else {
    res.type('txt').send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});