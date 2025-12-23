import mongoose from "mongoose";

export const deviceSchema = new mongoose.Schema(
  {
    deviceType: String,
    os: String,
    browser: String,
    ipAddress: String,
    location: {},
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);
