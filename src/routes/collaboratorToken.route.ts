import express from "express";
const router = express.Router();
import * as ctrl from "../controllers/collaboratorToken.controller";
import jwtMiddleware from "../middlewares/jwt.middleware";
import collaboratorMiddleware from "../middlewares/collaborator.middleware";
import adminMiddleware from "../middlewares/admin.middleware";

router.post("/createToken", jwtMiddleware, ctrl.createToken);

router.get(
  "/findHistory",
  jwtMiddleware,
  collaboratorMiddleware,
  ctrl.transactionHistory
);

router.post(
  "/createWithdraw",
  jwtMiddleware,
  collaboratorMiddleware,
  ctrl.createWithdraw
);

router.post(
  "/withdrawToken",
  jwtMiddleware,
  adminMiddleware,
  ctrl.withdrawTokenByAdmin
);

export default router;
