import express from "express";
const router = express.Router();
import * as ctrl from "../controllers/marketerDeposit.controller";
import jwtMiddleware from "../middlewares/jwt.middleware";
import marketerMiddleware from "../middlewares/marketer.middleware";

router.post("/momo", jwtMiddleware, marketerMiddleware, ctrl.momoCreateRequest);

router.post(
  "/momo_ipn",
  jwtMiddleware,
  marketerMiddleware,
  ctrl.momoIPNRequest
);

export default router;
