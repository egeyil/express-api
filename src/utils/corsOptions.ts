import allowedOrigins from '../config/allowedOrigins.js';
import {CorsOptions} from "cors";

const corsOptions: CorsOptions  = {
  origin: (origin, callback)=> {
    // Remove !origin if you do not want to allow requests with no origin (Server-to-server requests or local tools)
    if (origin && allowedOrigins.indexOf(origin) !== -1 || !origin) {
      return callback(null, true)
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200
}

export default corsOptions;