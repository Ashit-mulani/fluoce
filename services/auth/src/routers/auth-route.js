import { Router } from "express";
import {
  emailAuth,
  emailVerify,
  googleAuth,
  logout,
  refreshToken,
} from "../controllers/auth-controller.js";

const authRouter = Router();

authRouter.route("/email").post(emailAuth);

authRouter.route("/email/verify").post(emailVerify);

authRouter.route("/google").post(googleAuth);

authRouter.route("/refresh").post(refreshToken);

authRouter.route("/me").post(refreshToken);

authRouter.route("/logout").post(logout);

export default authRouter;
