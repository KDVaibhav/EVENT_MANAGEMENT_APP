import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import appRouter from "./routes";
import connectDb from "./db";
import { seedData } from "./seed";
dotenv.config();
const app = express();

const startServer = async () => {
  // Wait for database connection first
  await connectDb();

  // Now seed data after connection is established
  await seedData();

  const allowedOrigins = [
    process.env.FRONTEND_URI,
    "http://localhost:3000",
  ].filter(Boolean); // Remove undefined values

  app.use(
    cors({
      origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          console.log("Blocked by CORS:", origin);
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    })
  );
  app.options(/.*/, (req, res) => {
    res.header(
      "Access-Control-Allow-Origin",
      req.headers.origin || allowedOrigins[0]
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Accept"
    );
    res.header("Access-Control-Allow-Credentials", "true");
    res.status(200).send();
  });

  app.get("/", (req, res) => {
    res.json("EMA_BACKEND");
  });

  app.get("/debug-env", (req, res) => {
    res.json({
      hasMongoDbUri: !!process.env.MONGODB_URI,
      hasMongoUri: !!process.env.MONGO_URI,
      nodeEnv: process.env.NODE_ENV,
      frontendUri: process.env.FRONTEND_URI,
      // Don't log the actual connection string for security
      mongoUriLength: process.env.MONGO_URI?.length || 0,
      mongoUriStartsWith: process.env.MONGO_URI?.substring(0, 20) || "none",
    });
  });
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log("Origin:", req.headers.origin);
    console.log("Headers:", req.headers);
    next();
  });

  app.use(
    cors({
      origin: process.env.FRONTEND_URI || "http://localhost:3000",
      credentials: true,
    })
  );

  // Body parsing middleware
  app.use(express.json());

  // Routes
  app.use("/api", appRouter);

  const PORT = process.env.BACKEND_PORT || 4000;
  app.listen(PORT, () => console.log(`Backend Started on PORT ${PORT}`));
};
startServer().catch(console.error);

export default app;
