import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import appRouter from "./routes";
import connectDb from "./db";
import { seedData } from "./seed";
dotenv.config();

connectDb();
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URI || "http://localhost:3000",
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json());
seedData();

// Routes
app.use("/api", appRouter);

const PORT = process.env.BACKEND_PORT || 4000;
app.listen(PORT, () => console.log(`Backend Started on PORT ${PORT}`));
