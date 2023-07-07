import express from "express";
const router = express.Router();
import * as ctrl from "../controllers/customerIncome.controller";
import jwtMiddleware from "../middlewares/jwt.middleware";
import adminMiddleware from "../middlewares/admin.middleware";

router.post("/create", jwtMiddleware, ctrl.create);

export default router;
