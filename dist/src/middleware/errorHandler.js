"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logEvents_js_1 = require("./logEvents.js");
const errorHandler = (err, req, res, next) => {
    (0, logEvents_js_1.logEvents)(`${err.name}: ${err.message}`, 'errLog.txt');
    console.error(err.stack);
    res.status(500).json({ "error": "500 Internal Server Error" });
};
exports.default = errorHandler;
//# sourceMappingURL=errorHandler.js.map