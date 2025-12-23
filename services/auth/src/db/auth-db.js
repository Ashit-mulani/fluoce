import mongoose from "mongoose";
import logger from "../utils/logger.js";
import dotenv from "dotenv";

dotenv.config();

const authDB = async () => {
  const mongoUrl = process.env.DB;
  try {
    await mongoose.connect(`${mongoUrl}`);
    logger.trace("authDB connected");
  } catch (error) {
    logger.warn({ error }, "_F failed to connect authDB");
  }
};

export default authDB;
