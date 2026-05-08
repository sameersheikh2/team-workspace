import authService from "../services/authService.js";
import { successResponse } from "../middleware/apiResponse.js";

class AuthController {
  async register(req, res) {
    const user = await authService.signup(req.body);
    return successResponse(res, user, "User registered successfully", 201);
  }

  async login(req, res) {
    const result = await authService.login(req.body);
    return successResponse(res, result, "Login successful", 200);
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
