import express from "express";
import { errorHandler, NotFoundError } from "./src/utils/globalError.js";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./src/config/db.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "server is running healthy",
  });
});

app.use("/", (req, res, next) => {
  next(new NotFoundError("Route"));
});

app.use(errorHandler);

connectDB().then(
  app.listen(5000, (req, res) => {
    console.log("Server listening on port number 5000");
  }),
);
