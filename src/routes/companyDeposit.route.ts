import express from "express";
import * as ctrl from "../controllers/companyDeposit.controller";
import jwtMiddleware from "../middlewares/jwt.middleware";
import companyMiddleware from "../middlewares/company.middleware";
import adminMiddleware from "../middlewares/admin.middleware";
const router = express.Router();

router.post("/company", jwtMiddleware, companyMiddleware, ctrl.getByCompany);

router.post("/", jwtMiddleware, adminMiddleware, ctrl.getByAdmin);

router.post("/momo", jwtMiddleware, companyMiddleware, ctrl.momoCreateRequest);

router.post("/momo_ipn", ctrl.momoIPNRequest);

export default router;
