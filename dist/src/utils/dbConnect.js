"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        let db = process.env.DATABASE_URI || '';
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
    }
    catch (e) {
        console.log(e);
        process.exit(1);
    }
};
exports.disconnectDB = disconnectDB;
exports.default = connectDB;
//# sourceMappingURL=dbConnect.js.map