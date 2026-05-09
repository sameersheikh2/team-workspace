import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxLength: 12,
      minLength: 3,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true,
    },
    password: { type: String, select: false, required: true, minLength: 6 },
    role: { type: String, enum: ["user"], default: "user" },
    isOnboarded: { type: Boolean, default: false },
    refreshToken: { type: String, select: false },
  },
  { timestamps: true },
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comparePassword = function (userPassword) {
  return bcrypt.compare(userPassword, this.password);
};

export default mongoose.model("User", UserSchema);
