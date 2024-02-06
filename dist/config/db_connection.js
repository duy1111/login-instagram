"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "./config.env" });
const MONGO_URI = process.env.MONGO_URI;
function db_connection() {
    mongoose_1.default
        .connect(MONGO_URI, { dbName: process.env.DB_NAME })
        .then(() => {
        console.log("MongoDB connected successfully".green);
    })
        .catch((error) => {
        console.log("MongoDB connection failed".red.bold);
        console.error(`${error.message}`.red);
        process.exit(1);
        // restart the server
    });
}
exports.default = db_connection;
