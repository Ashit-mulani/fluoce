import express from "express";
import cors from "cors";
import { errorHandler } from "./utils/errorHandler.js";
import folderRouter from "./routers/folder-route.js";
import fileRouter from "./routers/file-route.js";
import shareRouter from "./routers/share-route.js";
import uiRouter from "./routers/ui-route.js";

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

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/read/api/v2/folder", folderRouter);

app.use("/read/api/v2/file", fileRouter);

app.use("/read/api/v2/share", shareRouter);

app.use("/read/api/v2", uiRouter);

app.use(errorHandler);

export default app;
