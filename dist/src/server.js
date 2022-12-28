"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const app = (0, express_1.default)();
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const corsOptions_1 = __importDefault(require("./utils/corsOptions"));
const logEvents_1 = require("./middleware/logEvents");
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const dbConnect_1 = __importDefault(require("./utils/dbConnect"));
const credentials_1 = __importDefault(require("./middleware/credentials"));
const response_time_1 = __importDefault(require("response-time"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const compression_1 = __importDefault(require("compression"));
const metrics_1 = require("./utils/metrics");
const swagger_1 = __importDefault(require("./utils/swagger"));
dotenv_1.default.config();
const PORT = Number(process.env.PORT) || 3500;
// Connect to MongoDB
(0, dbConnect_1.default)();
// Compress all responses
app.use((0, compression_1.default)());
// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials_1.default);
// Cross Origin Resource Sharing
app.use((0, cors_1.default)(corsOptions_1.default));
// built-in middleware to handle urlencoded form data
app.use(express_1.default.urlencoded({ extended: false, limit: '30kb' }));
app.use(express_1.default.json({ limit: '30kb' }));
// built-in middleware for json
app.use(express_1.default.json());
//middleware for cookies
app.use((0, cookie_parser_1.default)());
//serve static files
app.use('/', express_1.default.static(path_1.default.join(__dirname, '/public')));
// Set security HTTP headers
app.use((0, helmet_1.default)());
// Prevent http param pollution
app.use((0, hpp_1.default)());
// Data sanitization against XSS
//app.use(xss());
// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
    app.use(logEvents_1.logger);
}
// Limit requests from same IP to 150 per hour for API Routes
const apiLimiter = (0, express_rate_limit_1.default)({
    max: 150,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in 15 minutes!',
    standardHeaders: true,
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use('/api', apiLimiter);
/* ***** ROUTES ***** */
// Import all routes
const auth_1 = __importDefault(require("./routes/auth"));
// Mount routers
app.use('/api/auth', auth_1.default);
app.use(errorHandler_1.default);
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.json({ "error": "404 Not Found" });
        // res.sendFile(path.join(__dirname, 'views', '404.html'));
    }
    else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    }
    else {
        res.type('txt').send("404 Not Found");
    }
});
app.use((0, response_time_1.default)((req, res, time) => {
    if (req?.route?.path) {
        metrics_1.restResponseTimeHistogram.observe({
            method: req.method,
            route: req.route.path,
            status_code: res.statusCode,
        }, time * 1000);
    }
}));
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await (0, dbConnect_1.default)();
    console.log('Connected to MongoDB');
    (0, metrics_1.startMetricsServer)();
    (0, swagger_1.default)(app, PORT);
});
//# sourceMappingURL=server.js.map