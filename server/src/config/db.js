import mongoose from "mongoose";
import config from "./env.js";
import { DatabaseError } from "../utils/globalError.js";

async function connectDB() {
  try {
    await mongoose.connect(config.mongoUri);
  } catch (error) {
    throw new DatabaseError(
      "Can't connect to the database",
      "Connection error with ",
    );
  }
}
export default connectDB;

// period of personal devlopment
