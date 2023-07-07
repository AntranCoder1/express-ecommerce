import express from "express";
import * as ctrl from "../controllers/companyToken.controller";
import jwtMiddleware from "../middlewares/jwt.middleware";
import companyMiddleware from "../middlewares/company.middleware";
import adminMiddleware from "../middlewares/admin.middleware";
const router = express.Router();

router.post(
  "/createToken",
  jwtMiddleware,
  companyMiddleware,
  ctrl.createDeposit
);

router.get("/getTokenCompany", ctrl.getTokenCompany);

router.post(
  "/getHistory",
  jwtMiddleware,
  companyMiddleware,
  ctrl.transactionHistory
);

router.post(
  "/createWithdraw",
  jwtMiddleware,
  companyMiddleware,
  ctrl.createWithdraw
);

router.post(
  "/withdrawToken",
  jwtMiddleware,
  adminMiddleware,
  ctrl.withdrawTokenByAdmin
);

export default router;
