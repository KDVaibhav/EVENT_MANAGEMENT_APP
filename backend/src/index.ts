import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import appRouter from "./routes";
import { seedData } from "./seed";
import mongoose from "mongoose";
dotenv.config();
const app = express();

let isConnected = false;

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    isConnected = true;
    console.log("Server connected to DB");
  } catch (error) {
    console.error("Error Connecting to MongoDB", error);
  }
};

const startServer = async () => {
  await connectDb();
  await seedData();
};

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

app.use((req, res, next) => {
  if (!isConnected) {
    startServer();
  }
  next();
});

app.get("/", (req, res) => {
  res.json({
    message: "EMA_BACKEND",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api", appRouter);

export default app;

// const allowedOrigins = [
//   process.env.FRONTEND_URI,
//   "http://localhost:3000",
// ].filter(Boolean);

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin) return callback(null, true);

//       if (allowedOrigins.indexOf(origin) !== -1) {
//         callback(null, true);
//       } else {
//         console.log("Blocked by CORS:", origin);
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization", "Accept"],
//   })
// );
// app.options(/.*/, (req, res) => {
//   res.header(
//     "Access-Control-Allow-Origin",
//     req.headers.origin || allowedOrigins[0]
//   );
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Content-Type, Authorization, Accept"
//   );
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.status(200).send();
// });

// app.use((req, res, next) => {
//   console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
//   console.log("Origin:", req.headers.origin);
//   console.log("Headers:", req.headers);
//   next();
// });
