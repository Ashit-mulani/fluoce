import { Router } from "express";
import { payOrder } from "../controllers/pay-controller.js";

const payRouter = Router();

payRouter.route("/order").post(payOrder);

export default payRouter;
