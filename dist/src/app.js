"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const corsOptions_1 = __importDefault(require("./utils/corsOptions"));
const logEvents_1 = require("./middleware/logEvents");
const credentials_1 = __importDefault(require("./middleware/credentials"));
const response_time_1 = __importDefault(require("response-time"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const compression_1 = __importDefault(require("compression"));
const metrics_1 = require("./utils/metrics");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
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
    max: 200,
    windowMs: 10 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in 15 minutes!',
    standardHeaders: true,
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use('/api', apiLimiter);
// Limit requests from same IP to 150 per hour for API/AUTH Routes
const authLimiter = (0, express_rate_limit_1.default)({
    max: 40,
    windowMs: 10 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in 15 minutes!',
    standardHeaders: true,
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use('/api/auth', authLimiter);
// Mount routes
(0, routes_1.default)(app);
app.use((0, response_time_1.default)((req, res, time) => {
    if (req?.route?.path) {
        metrics_1.restResponseTimeHistogram.observe({
            method: req.method,
            route: req.route.path,
            status_code: res.statusCode,
        }, time * 1000);
    }
}));
exports.default = app;
//# sourceMappingURL=app.js.map