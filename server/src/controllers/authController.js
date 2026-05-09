import authService from "../services/authService.js";
import { successResponse } from "../middleware/apiResponse.js";

class AuthController {
  async register(req, res) {
    const user = await authService.signup(req.body);
    return successResponse(res, user, "User registered successfully", 201);
  }

  async login(req, res) {
    const result = await authService.login(req.body);
    const { refreshToken } = result;
    result.refreshToken = undefined;
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true, // enable in production (https)
      sameSite: "strict",
    });
    return successResponse(res, result, "Login successful", 200);
  }

  async logout(req, res) {
    const userId = req.user.id;
    await authService.logout(userId);
    res.clearCookie("refreshToken");
    return successResponse(res, null, "Logged out successfully", 200);
  }

  async refresh(req, res) {
    const token = req.cookies.refreshToken;
    const accessToken = authService.refreshAccessToken(token);
    return successResponse(res, { accessToken }, "Access token refreshed", 200);
  }
}

export default new AuthController();

//intro
//star method
//prep method

//technical topics
//mahendra --> closure
//aditya --> joins
//aman -->  event loop
//ashutosh -->
