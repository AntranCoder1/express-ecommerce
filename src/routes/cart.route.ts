import express from "express";
const router = express.Router();
import * as ctrl from "../controllers/cart.controller";
import jwtMiddleware from "../middlewares/jwt.middleware";

router.get("", jwtMiddleware, ctrl.getAll);
router.post("/update", jwtMiddleware, ctrl.updateCart);
router.post("/create", jwtMiddleware, ctrl.createCart);
export default router;
