import express from "express";
import { NotFoundError } from "./src/utils/globalError.js";
import { errorHandler } from "./src/middleware/apiResponse.js";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./src/config/db.js";
import cookieParser from "cookie-parser";
import limiter from "./src/middleware/rateLimiter.js";
import config from "./src/config/env.js";
import authRouter from "./src/routes/authRoutes.js";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin:
      config.env === "production" ? "frontendurl.com" : "http://localhost:5173",
    credentials: true,
  }),
);
app.use(helmet());
app.use(cookieParser());
app.use(limiter);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "server is running healthy",
  });
});

app.use("/api/auth", authRouter);

app.use("/", (req, res, next) => {
  next(new NotFoundError(`Route`));
});

app.use(errorHandler);

connectDB().then(
  app.listen(5000, (req, res) => {
    console.log("Server listening on port number 5000");
  }),
);
