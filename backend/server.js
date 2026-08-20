import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

// Load environment variables immediately before any other setup
dotenv.config();

// Ensure __dirname is calculated properly for ES Modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// Allowed CORS origins for local development and production deployments
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like Postman, mobile apps, or server-to-server)
      if (!origin) return callback(null, true);

      const formattedOrigin = origin.replace(/\/$/, "");
      const isAllowed = allowedOrigins.some(
        (allowed) => allowed.replace(/\/$/, "") === formattedOrigin
      );

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`CORS error: Origin ${origin} not allowed`));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Static file serving for uploaded cover images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", userRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Inkwell API is running",
    timestamp: new Date(),
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB first, then start server listening
connectDB()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[Server] Inkwell API listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("[Database] Initial MongoDB connection error:", err.message);
    process.exit(1);
  });