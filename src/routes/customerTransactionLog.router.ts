import express from "express";
const router = express.Router();
import * as ctrl from "../controllers/customerTransactionLog.controller";
import jwtMiddleware from "../middlewares/jwt.middleware";
import adminMiddleware from "../middlewares/admin.middleware";

router.post("/customer", jwtMiddleware, ctrl.getByCustomer);

router.post("/", jwtMiddleware, adminMiddleware, ctrl.getAll);

export default router;
