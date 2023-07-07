import express from "express";
const router = express.Router();
import jwtMiddleware from "../middlewares/jwt.middleware";
import * as ctrl from "../controllers/customerDeposit.controller";

router.post("/momo", jwtMiddleware, ctrl.momoCreateRequest);

router.post("/momo_ipn", ctrl.momoIPNRequest);

export default router;
