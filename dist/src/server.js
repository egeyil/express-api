"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const dbConnect_1 = __importDefault(require("./utils/dbConnect"));
const swagger_1 = __importDefault(require("./utils/swagger"));
const config_1 = __importDefault(require("./config/config"));
const PORT = Number(config_1.default.port);
async function startServer() {
    await (0, dbConnect_1.default)();
    (0, swagger_1.default)(app_1.default, PORT);
    app_1.default.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
startServer();
//# sourceMappingURL=server.js.map