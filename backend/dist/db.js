"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
let cachedConnection = null;
const connectDb = async () => {
    if (cachedConnection) {
        return cachedConnection;
    }
    const connectionString = process.env.MONGO_URI;
    try {
        const client = await mongoose_1.default.connect(connectionString, {
            bufferCommands: false,
        });
        console.log("Server connected to DB");
        cachedConnection = client;
        return client;
    }
    catch (error) {
        console.error("Error Connecting MongoDB", error);
    }
};
exports.default = connectDb;
