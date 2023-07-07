import express from "express";
const router = express.Router();
import * as ctrl from "../controllers/markerterToken.controller";
import jwtMiddleware from "../middlewares/jwt.middleware";
import marketerMiddleware from "../middlewares/marketer.middleware";
import adminMiddleware from "../middlewares/admin.middleware";

router.post("/createToken", jwtMiddleware, ctrl.createToken);

router.get(
  "/findHistory",
  jwtMiddleware,
  marketerMiddleware,
  ctrl.transactionHistory
);

router.post(
  "/createWithdraw",
  jwtMiddleware,
  marketerMiddleware,
  ctrl.createWithdraw
);

router.post(
  "/withdrawToken",
  jwtMiddleware,
  adminMiddleware,
  ctrl.withdrawTokenByAdmin
);

export default router;
