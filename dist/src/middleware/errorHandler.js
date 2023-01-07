"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logEvents_1 = require("./logEvents");
// This middleware is used as a global error handler. It will catch any errors
const errorHandler = async (err, req, res, next) => {
    await (0, logEvents_1.logEvents)(`${err.name}: ${err.message}`, 'errLog.txt');
    console.error(err.stack);
    res.status(500).json({ "error": "500 Internal Server Error" });
};
exports.default = errorHandler;
//# sourceMappingURL=errorHandler.js.map