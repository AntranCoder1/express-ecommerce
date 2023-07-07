import express from "express";
const router = express.Router();
import * as ctrl from "../controllers/adminTransactionLog.controller";
import jwtMiddleware from "../middlewares/jwt.middleware";
import adminMiddleware from "../middlewares/admin.middleware";

router.post("/getTransationToken", ctrl.getList);

export default router;
