"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../config/config"));
const connectDB = async () => {
    try {
        const { databaseUrl } = config_1.default;
        if (!databaseUrl) {
            console.error('No database url found');
            process.exit(1);
        }
        const conn = await mongoose_1.default.connect(databaseUrl);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (err) {
        console.error(err);
    }
};
const disconnectDB = async () => {
    try {
        await mongoose_1.default.connection.close();
    }
    catch (e) {
        console.log(e);
        process.exit(1);
    }
};
exports.disconnectDB = disconnectDB;
exports.default = connectDB;
//# sourceMappingURL=dbConnect.js.map