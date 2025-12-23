import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import {
  getActivity,
  getDashboard,
  getStorage,
} from "../controllers/ui-controller.js";

const uiRouter = Router();

uiRouter.route("/dashboard").get(auth, getDashboard);

uiRouter.route("/storage").get(auth, getStorage);

uiRouter.route("/activity").get(auth, getActivity);

export default uiRouter;
