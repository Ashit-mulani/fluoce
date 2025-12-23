import express from "express";
import cors from "cors";
import { errorHandler } from "./utils/errorHandler.js";
import authRouter from "./routers/auth-route.js";
import cookieParser from "cookie-parser";
import folderRouter from "./routers/folder-route.js";
import fileRouter from "./routers/file-route.js";
import shareRouter from "./routers/share-route.js";
import uiRouter from "./routers/ui-route.js";
import payRouter from "./routers/pay-router.js";
import { payWebHook } from "./controllers/pay-controller.js";

const app = express();

app.get("/h", (_, res) => {
  return res.status(200).json({ message: "_ok auth-imagebox-BFF 8000" });
});

const ALLOWED_ORIGINs = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:4000",
  "http://localhost:5174",
];

app.use(
  cors({
    origin: ALLOWED_ORIGINs,
    credentials: true,
  })
);

app.use(cookieParser());

//webhook rawdata

app.post(
  "/write/api/v2/webhook/razorpay",
  express.raw({ type: "*/*" }),
  payWebHook
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// auth

app.use("/auth/api/v2", authRouter);

// write

app.use("/write/api/v2/folder", folderRouter);

app.use("/write/api/v2/file", fileRouter);

app.use("/write/api/v2/share", shareRouter);

app.use("/write/api/v2/pay", payRouter);

// read

app.use("/read/api/v2/folder", folderRouter);

app.use("/read/api/v2/file", fileRouter);

app.use("/read/api/v2/share", shareRouter);

app.use("/read/api/v2", uiRouter);

app.use(errorHandler);

export default app;
