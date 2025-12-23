import mongoose from "mongoose";

const providerSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["google", "facebook", "apple", "github"],
    required: true,
  },
  providerId: {
    type: String,
    trim: true,
  },
  lastUsed: {
    type: Date,
    default: Date.now,
  },
});

const userScheam = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    profilePhoto: {
      type: String,
      trim: true,
    },
    providers: {
      type: [providerSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userScheam);

export default User;
