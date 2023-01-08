"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const connectDB = async () => {
    try {
        // const db = config.get<string>("DATABASE_URI);
        if (process.env.NODE_ENV === 'test') {
            const mongodb = new mongodb_memory_server_1.MongoMemoryServer();
            const uri = mongodb.getUri();
            await mongoose_1.default.connect(uri);
            return;
        }
        else {
            const db = process.env.DATABASE_URI || '';
            await mongoose_1.default.connect(db);
        }
    }
    catch (err) {
        console.error(err);
    }
};
exports.default = connectDB;
//# sourceMappingURL=dbConnect.js.map