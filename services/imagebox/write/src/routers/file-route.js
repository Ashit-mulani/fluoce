import { Router } from "express";
import {
  createFile,
  updateFile,
  toggelTrashOrFavoriteFile,
  deleteFile,
  preSignedUrl,
  moveFile,
} from "../controllers/file-controller.js";
import { folderAuth } from "../middlewares/folder-middleware.js";
import { fileAuth } from "../middlewares/file-middleware.js";

const fileRouter = Router();

fileRouter.route("/presignedurl/:folderId").post(folderAuth, preSignedUrl);

fileRouter.route("/:folderId").post(folderAuth, createFile);

fileRouter.route("/:folderId/:fileId").put(folderAuth, fileAuth, updateFile);

fileRouter
  .route("/:folderId/:fileId")
  .patch(folderAuth, fileAuth, toggelTrashOrFavoriteFile);

fileRouter.route("/move/:folderId/:fileId").put(folderAuth, fileAuth, moveFile);

fileRouter.route("/:folderId/:fileId").delete(folderAuth, fileAuth, deleteFile);

export default fileRouter;
