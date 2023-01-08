"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
let mongod = null;
const connectDB = async () => {
    try {
        // const db = config.get<string>("DATABASE_URI);
        let db = process.env.DATABASE_URI || '';
        if (process.env.NODE_ENV === 'test') {
            mongod = new mongodb_memory_server_1.MongoMemoryServer();
            db = mongod.getUri();
        }
        const conn = await mongoose_1.default.connect(db);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (err) {
        console.error(err);
    }
};
const disconnectDB = async () => {
    try {
        await mongoose_1.default.connection.close();
        if (process.env.NODE_ENV === 'test') {
            await mongod.stop();
        }
    }
    catch (e) {
        console.log(e);
        process.exit(1);
    }
};
exports.disconnectDB = disconnectDB;
exports.default = connectDB;
//# sourceMappingURL=dbConnect.js.map