import express from "express";
import cors from "cors";
import { errorHandler } from "./utils/errorHandler.js";
import authRouter from "./routers/auth-route.js";
import cookieParser from "cookie-parser";

const app = express();

app.get("/h", (_, res) => {
  return res.status(200).json({ message: "_ok auth-imagebox-auth 8001" });
});

const ALLOWED_ORIGINs = ["http://localhost:8000"];

app.use(
  cors({
    origin: ALLOWED_ORIGINs,
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/auth/api/v2", authRouter);

app.use(errorHandler);

export default app;
