import UserRepo from "../repository/userRepository.js";
import { AuthError, ValidationError } from "../utils/globalError.js";
import jwt from "jsonwebtoken";
import config from "../config/env.js";

class AuthService {
  async signup(user) {
    const { name, email, password, role } = user;
    const isExist = await UserRepo.findByEmail(email);

    if (isExist) {
      throw new ValidationError("Validation failed.", {
        email: "User already exist.",
      });
    }

    if (!["admin", "member"].includes(role)) {
      throw new ValidationError("Validation failed.", {
        role: "Role does not exist.",
      });
    }
    const newUser = await UserRepo.create(user);
    newUser.password = undefined;
    return newUser;
  }

  async login({ email, password }) {
    if (!email || !password) {
      throw new AuthError("Authentication Failed");
    }
    const normalizedEmail = email.trim().toLowerCase();
    const user = await UserRepo.findByEmail(normalizedEmail, {
      includePassword: true,
    });
    if (!user) {
      throw new ValidationError("Invalid Credentials.", {
        email: "Invalid Credentials or user does not exist.",
        password: "Invalid Credentials or user does not exist.",
      });
    }

    const isMatch = await UserRepo.comparePassword(user._id, password);
    if (!isMatch) {
      throw new ValidationError("Invalid Credentials.", {
        password: "Invalid Credentails or user does not exist.",
      });
    }
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);
    user.password = undefined;
    return { user, accessToken, refreshToken };
  }

  async logout(userId) {
    // Optional: Invalidate refresh token in database for extra security
    await UserRepo.updateRefreshToken(userId, null);
  }

  refreshAccessToken(token) {
    if (!token) {
      throw new AuthError("No refresh token provided");
    }

    try {
      const decoded = jwt.verify(token, config.jwtRefreshSecret);
      const newAccessToken = this.generateAccessToken(decoded);
      return newAccessToken;
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        throw new AuthError("Refresh token expired. Please login again.");
      }
      throw new AuthError("Invalid refresh token");
    }
  }

  generateAccessToken(user) {
    return jwt.sign({ id: user._id, role: user.role }, config.jwtAccessSecret, {
      expiresIn: config.jwtAccessExpire,
    });
  }

  generateRefreshToken(user) {
    return jwt.sign(
      { id: user._id, role: user.role },
      config.jwtRefreshSecret,
      { expiresIn: config.jwtRefreshExpire },
    );
  }
}

export default new AuthService();
