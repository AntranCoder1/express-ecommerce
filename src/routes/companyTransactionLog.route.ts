import express from "express";
const router = express.Router();
import * as ctrl from "../controllers/companyTransactionLog.controller";
import jwtMiddleware from "../middlewares/jwt.middleware";
import companyMiddleware from "../middlewares/company.middleware";
import adminMiddleware from "../middlewares/admin.middleware";

router.post("/company", jwtMiddleware, companyMiddleware, ctrl.getByCompany);

router.post("/", jwtMiddleware, adminMiddleware, ctrl.getAll);

export default router;
