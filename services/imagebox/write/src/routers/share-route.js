import { Router } from "express";
import { createShare, deleteShare } from "../controllers/share-controller.js";
import { folderAuth } from "../middlewares/folder-middleware.js";
import { fileAuth } from "../middlewares/file-middleware.js";

const shareRouter = Router();

shareRouter.route("/:folderId/:fileId").post(folderAuth, fileAuth, createShare);

shareRouter.route("/:shareId").delete(deleteShare);

export default shareRouter;
