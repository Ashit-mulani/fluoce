import { Router } from "express";
import { getFolders } from "../controllers/folder-controller.js";
import { folderAuth } from "../middlewares/folder-middleware.js";

const folderRouter = Router();

folderRouter.route("/").get(getFolders);

export default folderRouter;
