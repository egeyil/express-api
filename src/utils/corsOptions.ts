import config from '../config/config';
import {CorsOptions} from "cors";

const {allowedOrigins} = config;

const corsOptions: CorsOptions  = {
  origin: (origin, callback)=> {
    // Remove !origin if you do not want to allow requests with no origin (Server-to-server requests or local tools)
    if (origin && allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true)
    } else if (process.env.NODE_ENV === 'development' && !origin) {
      return callback(null, true)
    }
    else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200
}

export default corsOptions;