import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const app = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173', // The frontend origin
  credentials: true, // Allow cookies and other credentials
  methods: 'GET,POST,PUT,DELETE', // Allowed methods
  allowedHeaders: 'Content-Type,Authorization' // Allowed headers
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

// Middleware to log parsed cookies for debugging
app.use((req, res, next) => {
  console.log("Parsed Cookies:", req.cookies);
  next();
});


app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

// Error handling middleware

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});