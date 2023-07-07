import express from "express";
const router = express.Router();
import * as ctrl from "../controllers/collaboratorDeposit.controller";
import jwtMiddleware from "../middlewares/jwt.middleware";
import collaboratorMiddleware from "../middlewares/collaborator.middleware";

router.post(
  "/momo",
  jwtMiddleware,
  collaboratorMiddleware,
  ctrl.momoCreateRequest
);

router.post(
  "/momo_ipn",
  jwtMiddleware,
  collaboratorMiddleware,
  ctrl.momoIPNRequest
);

export default router;
