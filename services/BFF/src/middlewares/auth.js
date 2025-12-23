import jwt from "jsonwebtoken";
import { asyncFunc } from "../utils/asyncFunc.js";
import dotenv from "dotenv";
import { apiRes } from "../utils/apiRes.js";

dotenv.config();

export const auth = asyncFunc(async (req, res, next) => {
  const accessToken =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!accessToken) {
    return res.status(401).json(new apiRes(401, undefined, "Invalid token"));
  }

  try {
    const user = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET);

    if (!user || !user._id) {
      return res.status(401).json(new apiRes(401, undefined, "Invalid token"));
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json(new apiRes(401, undefined, "Invalid token"));
  }
});
