import dotenv from "dotenv";
dotenv.config();

const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtAccessExpire: process.env.JWT_ACCESS_EXPIRE || "15m",
  jwtRefreshExpire: process.env.JWT_REFRESH_EXPIRE || "7d",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
};

export default config;
