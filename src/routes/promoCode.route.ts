import express from "express";
import jwtMiddleware from "../middlewares/jwt.middleware";
import marketerMiddleware from "../middlewares/marketer.middleware";
import * as ctrl from "../controllers/promoCode.controller";
const router = express.Router();
router.post("/create", jwtMiddleware, marketerMiddleware, ctrl.createPromoCode);
router.post("/check", ctrl.checkPromoCode);
export default router;
