import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import {
  createShare,
  deleteShare,
  getShare,
  getShareFile,
} from "../controllers/share-controller.js";
import { optionalAuth } from "../middlewares/optional-auth.js";

const shareRouter = Router();

//write

shareRouter.route("/:folderId/:fileId").post(auth, createShare);

shareRouter.route("/:shareId").delete(auth, deleteShare);

//read

shareRouter.route("/").get(auth, getShare);

shareRouter.route("/previewUrl/:shareId").get(optionalAuth, getShareFile);

export default shareRouter;
