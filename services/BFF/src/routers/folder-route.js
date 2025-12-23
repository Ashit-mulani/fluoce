import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import {
  createFolder,
  updateFolder,
  trashFolder,
  deleteFolder,
  getFolders,
} from "../controllers/folder-controller.js";

const folderRouter = Router();

//write

folderRouter.route("/").post(auth, createFolder);

folderRouter.route("/:folderId").put(auth, updateFolder);

folderRouter.route("/trash/:folderId").put(auth, trashFolder);

folderRouter.route("/:folderId").delete(auth, deleteFolder);

// read

folderRouter.route("/").get(auth, getFolders);

export default folderRouter;
