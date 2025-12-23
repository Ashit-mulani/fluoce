import { Router } from "express";
import {
  createFolder,
  updateFolder,
  trashFolder,
  deleteFolder,
} from "../controllers/folder-controller.js";
import { folderAuth } from "../middlewares/folder-middleware.js";

const folderRouter = Router();

folderRouter.route("/").post(createFolder);

folderRouter.route("/:folderId").put(folderAuth, updateFolder);

folderRouter.route("/trash/:folderId").put(folderAuth, trashFolder);

folderRouter.route("/:folderId").delete(folderAuth, deleteFolder);

export default folderRouter;
