import { Router } from "express";
import { getShare, getShareFile } from "../controllers/share-controller.js";

const shareRouter = Router();

shareRouter.route("/").get(getShare);

shareRouter.route("/previewUrl/:shareId").get(getShareFile);

export default shareRouter;
