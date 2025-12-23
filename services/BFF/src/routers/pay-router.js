import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { payOrder } from "../controllers/pay-controller.js";

const payRouter = Router();

payRouter.route("/order").post(auth, payOrder);

export default payRouter;
