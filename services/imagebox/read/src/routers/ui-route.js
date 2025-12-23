import { Router } from "express";
import {
  getActivity,
  getDashboard,
  getStorage,
} from "../controllers/ui-controller.js";

const uiRouter = Router();

uiRouter.route("/dashboard").get(getDashboard);

uiRouter.route("/storage").get(getStorage);

uiRouter.route("/activity").get(getActivity);

export default uiRouter;
