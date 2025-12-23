import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import {
  createFile,
  updateFile,
  deleteFile,
  preSignedUrl,
  toggelTrashOrFavoriteFile,
  moveFile,
  getFilesByFolder,
  getObjectPreviewUrl,
  getTrashFiles,
} from "../controllers/file-controller.js";

const fileRouter = Router();

//write

fileRouter.route("/presignedurl/:folderId").post(auth, preSignedUrl);

fileRouter.route("/:folderId").post(auth, createFile);

fileRouter.route("/:folderId/:fileId").put(auth, updateFile);

fileRouter.route("/:folderId/:fileId").patch(auth, toggelTrashOrFavoriteFile);

fileRouter.route("/move/:folderId/:fileId").put(auth, moveFile);

fileRouter.route("/:folderId/:fileId").delete(auth, deleteFile);

//read

fileRouter.route("/:folderId").get(auth, getFilesByFolder);

fileRouter
  .route("/previewUrl/:folderId/:fileId")
  .get(auth, getObjectPreviewUrl);

fileRouter.route("/trash").get(auth, getTrashFiles);

export default fileRouter;
