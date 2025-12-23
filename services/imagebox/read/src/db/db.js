import mongoose from "mongoose";
import logger from "../utils/logger.js";
import dotenv from "dotenv";

dotenv.config();

const DB = async () => {
  const mongoUrl = `${process.env.DB}`;
  try {
    await mongoose.connect(mongoUrl);
    logger.trace("DB connected");
  } catch (error) {
    console.log(error);

    logger.warn({ error }, "_F failed to connect DB");
  }
};

export default DB;
