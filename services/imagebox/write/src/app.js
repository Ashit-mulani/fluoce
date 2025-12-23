import express from "express";
import cors from "cors";
import { errorHandler } from "./utils/errorHandler.js";
import folderRouter from "./routers/folder-route.js";
import fileRouter from "./routers/file-route.js";
import shareRouter from "./routers/share-route.js";
import payRouter from "./routers/pay-router.js";
import { payWebHook } from "./controllers/pay-controller.js";

const app = express();

app.get("/h", (_, res) => {
  return res.status(200).json({ message: "_ok write-imagebox-BFF 9000" });
});

const ALLOWED_ORIGINs = ["http://localhost:8000"];

app.use(
  cors({
    origin: ALLOWED_ORIGINs,
    credentials: true,
  })
);

//webhook rawdata

app.post(
  "/write/api/v2/webhook/razorpay",
  express.raw({ type: "*/*" }),
  payWebHook
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/write/api/v2/folder", folderRouter);

app.use("/write/api/v2/file", fileRouter);

app.use("/write/api/v2/share", shareRouter);

app.use("/write/api/v2/pay", payRouter);

app.use(errorHandler);

export default app;
