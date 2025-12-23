import mongoose from "mongoose";
import { deviceSchema } from "./device-model.js";

const refreshTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
    index: true,
  },
  device: {
    type: deviceSchema,
  },
  userSnapshot: {
    email: {
      type: String,
    },
    name: {
      type: String,
    },
    profilePhoto: {
      type: String,
    },
    createdAt: {
      type: Date,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: () => Date.now() + 60 * 24 * 60 * 60 * 1000,
  },
});

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshToken =
  mongoose.models.RefreshToken ||
  mongoose.model("RefreshToken", refreshTokenSchema);

export default RefreshToken;
