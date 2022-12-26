import { logEvents } from './logEvents.js';
const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
    console.error(err.stack);
    res.status(500).json({ "error": "500 Internal Server Error" });
};
export default errorHandler;
