import User from "../models/User.js";

class UserRepository {
  create(user) {
    return User.create(user);
  }

  findByEmail(email, options = {}) {
    if (!email) return null;
    const cleaned = email.toLowerCase().trim();
    if (options.includePassword) {
      return User.findOne({ email: cleaned }).select("+password");
    }
    return User.findOne({ email: cleaned });
  }

  findById(id) {
    return User.findById(id);
  }

  async comparePassword(userId, userPassword) {
    const user = await User.findById(userId).select("+password");
    if (!user) return false;
    return user.comparePassword(userPassword);
  }

  updateRefreshToken(userId, token) {
    return User.findByIdAndUpdate(
      userId,
      { refreshToken: token },
      { new: true },
    );
  }
}

export default new UserRepository();
