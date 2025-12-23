import jwt from "jsonwebtoken";
import { asyncFunc } from "../utils/asyncFunc.js";
import dotenv from "dotenv";

dotenv.config();

export const optionalAuth = asyncFunc(async (req, res, next) => {
  const accessToken =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  try {
    const user = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET);
    req.user = user;
    next();
  } catch (error) {
    req.user = null;
    next();
  }
});
