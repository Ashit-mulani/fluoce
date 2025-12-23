import { Router } from "express";
import {
  getFilesByFolder,
  getObjectPreviewUrl,
  getTrashFiles,
} from "../controllers/file-controller.js";
import { folderAuth } from "../middlewares/folder-middleware.js";
import { fileAuth } from "../middlewares/file-middleware.js";

const fileRouter = Router();

fileRouter.route("/trash").get(getTrashFiles);

fileRouter.route("/:folderId").get(folderAuth, getFilesByFolder);

fileRouter
  .route("/previewUrl/:folderId/:fileId")
  .get(folderAuth, fileAuth, getObjectPreviewUrl);

export default fileRouter;
