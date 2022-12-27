"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const corsOptions_1 = __importDefault(require("./utils/corsOptions"));
const logEvents_1 = require("./middleware/logEvents");
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const dbConnect_1 = __importDefault(require("./utils/dbConnect"));
const credentials_1 = __importDefault(require("./middleware/credentials"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const PORT = process.env.PORT || 3500;
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
// Connect to MongoDB
(0, dbConnect_1.default)();
// custom middleware logger
app.use(logEvents_1.logger);
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
// Data sanitization against XSS
//app.use(xss());
// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
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
app.use(errorHandler_1.default);
mongoose_1.default.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
//# sourceMappingURL=server.js.map