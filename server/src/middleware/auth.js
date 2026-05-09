import config from "../config/env.js";
import { AuthError } from "../utils/globalError.js";
import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return next(new AuthError("No token found or not authenticated."));
  }

  jwt.verify(token, config.jwtAccessSecret, (err, user) => {
    if (err) {
      return next(new AuthError("No token found or not authenticated."));
    }
    req.user = user;
    next();
  });
};
