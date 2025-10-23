"use strict";
// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import appRouter from "./routes";
// import connectDb from "./db";
// import { seedData } from "./seed";
// dotenv.config();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const startServer = async () => {
//   // Wait for database connection first
//   await connectDb();
//   // Now seed data after connection is established
//   await seedData();
//   const app = express();
//   app.use(
//     cors({
//       origin: process.env.FRONTEND_URI || "http://localhost:3000",
//       credentials: true,
//     })
//   );
//   // Body parsing middleware
//   app.use(express.json());
//   // Routes
//   app.use("/api", appRouter);
//   const PORT = process.env.BACKEND_PORT || 4000;
//   app.listen(PORT, () => console.log(`Backend Started on PORT ${PORT}`));
// };
// startServer().catch(console.error);
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.json({ message: "Hello from Vercel!" });
});
app.get("/api/test", (req, res) => {
    res.json({ message: "Test API endpoint" });
});
exports.default = app;
