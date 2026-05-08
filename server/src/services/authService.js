import UserRepo from "../repository/userRepository.js";
import { AuthError, ValidationError } from "../utils/globalError.js";
import jwt from "jsonwebtoken";
import config from "../config/env.js";

class AuthService {
  async signup(user) {
    const { name, email, password, role } = user;
    const isExist = await UserRepo.findByEmail(email);
    console.log(isExist);

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

    return await UserRepo.create(user);
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

    const isMatch = UserRepo.comparePassword(user._id, password);
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
